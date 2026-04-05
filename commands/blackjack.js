const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const SUITS=['♠','♥','♦','♣'], RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const HIT='👊', STAND='🛑';

function createDeck(){return SUITS.flatMap(s=>RANKS.map(r=>({suit:s,rank:r})));}
function shuffle(d){for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function cardValue(c){if(['J','Q','K'].includes(c.rank))return 10;if(c.rank==='A')return 11;return parseInt(c.rank);}
function handValue(h){let t=h.reduce((s,c)=>s+cardValue(c),0),a=h.filter(c=>c.rank==='A').length;while(t>21&&a-->0)t-=10;return t;}
function formatHand(h){return h.map(c=>`${c.rank}${c.suit}`).join(' ');}
function gameEmbed(title,fields,footer){const e=new EmbedBuilder().setColor(0xFFC0CB).setTitle(`🃏 ${title}`).addFields(fields);if(footer)e.setFooter({text:footer});return e;}

const games=new Map();
async function addReactions(msg){try{await msg.react(HIT);await msg.react(STAND);}catch{}}
function setupCollector(botMsg,origMessage,userId){
  const filter=(r,u)=>[HIT,STAND].includes(r.emoji.name)&&u.id===userId;
  const col=botMsg.createReactionCollector({filter,time:60000,max:1});
  col.on('collect',async r=>{await playRound(origMessage,userId,r.emoji.name===HIT?'hit':'stand');});
}

async function playRound(message,userId,action){
  if(!games.has(userId))return;
  const game=games.get(userId);
  const user=getUser(userId);
  if(action==='hit'){
    game.playerHand.push(game.deck.pop());
    const pv=handValue(game.playerHand);
    if(pv>21){
      games.delete(userId);
      user.stress=Math.min(100,(user.stress||0)+10);
      saveUser(userId,user);
      return message.channel.send({content:`<@${userId}>`,embeds:[gameEmbed('Bust! 💥',[
        {name:'🃏 Таны карт',value:`${formatHand(game.playerHand)} = **${pv}**`},
        {name:'💸 Алдсан',value:`-₮${shortNum(game.bet)}`},
        {name:'👛 Cash',value:`₮${shortNum(user.cash)}`},
      ])]});
    }
    const msg=await message.channel.send({content:`<@${userId}>`,embeds:[gameEmbed('Blackjack',[
      {name:'🃏 Таны карт',value:`${formatHand(game.playerHand)} = **${pv}**`},
      {name:'🤖 Dealer',value:`${game.dealerHand[0].rank}${game.dealerHand[0].suit} **?**`},
    ],`${HIT} Hit | ${STAND} Stand`)]});
    await addReactions(msg);setupCollector(msg,message,userId);return;
  }
  while(handValue(game.dealerHand)<17)game.dealerHand.push(game.deck.pop());
  const pv=handValue(game.playerHand),dv=handValue(game.dealerHand);
  games.delete(userId);
  let resultText,moneyText;
  if(dv>21||pv>dv){user.cash+=game.bet*2;resultText='🏆 Таны хожлоо!';moneyText=`+₮${shortNum(game.bet)}`;}
  else if(pv===dv){user.cash+=game.bet;resultText='🤝 Тэнцлээ';moneyText='Мөнгө буцлаа';}
  else{user.stress=Math.min(100,(user.stress||0)+10);resultText='😔 Dealer хожлоо';moneyText=`-₮${shortNum(game.bet)}`;}
  saveUser(userId,user);
  message.channel.send({content:`<@${userId}>`,embeds:[gameEmbed(`Blackjack — ${resultText}`,[
    {name:'🃏 Тань',value:`${formatHand(game.playerHand)} = **${pv}**`,inline:true},
    {name:'🤖 Dealer',value:`${formatHand(game.dealerHand)} = **${dv}**`,inline:true},
    {name:'💰 Үр дүн',value:moneyText},{name:'👛 Cash',value:`₮${shortNum(user.cash)}`},
  ])]}); 
}

module.exports = {
  name:'blackjack',aliases:['bj'],
  async execute(message,args){
    const userId=message.author.id;
    const raw=args[0]?.toLowerCase();
    const action=raw==='h'?'hit':raw==='s'?'stand':raw;
    if(['hit','stand'].includes(action)){await playRound(message,userId,action);return;}
    const bet=parseInt(args[0]);
    if(!bet||bet<=0)return message.reply({embeds:[gameEmbed('Blackjack',[{name:'❌ Алдаа',value:'Жишээ: `!bj 500`'}])]});
    if(games.has(userId))return message.reply({embeds:[gameEmbed('Blackjack',[{name:'⚠️',value:`Тоглоом явагдаж байна! ${HIT} hit эсвэл ${STAND} stand`}])]});
    const user=getUser(userId);
    if(bet>user.cash)return message.reply({embeds:[gameEmbed('Blackjack',[{name:'❌',value:`Cash хүрэлцэхгүй! ₮${shortNum(user.cash)}`}])]});
    const deck=shuffle(createDeck());
    const playerHand=[deck.pop(),deck.pop()];
    const dealerHand=[deck.pop(),deck.pop()];
    user.cash-=bet;saveUser(userId,user);
    games.set(userId,{deck,playerHand,dealerHand,bet});
    const pv=handValue(playerHand);
    if(pv===21){
      user.cash+=Math.floor(bet*2.5);saveUser(userId,user);games.delete(userId);
      return message.reply({embeds:[gameEmbed('🎉 BLACKJACK!',[
        {name:'🃏 Карт',value:`${formatHand(playerHand)} = **${pv}**`},
        {name:'💰',value:`+₮${shortNum(Math.floor(bet*1.5))}`},
        {name:'👛 Cash',value:`₮${shortNum(user.cash)}`},
      ])]});
    }
    const botMsg=await message.reply({embeds:[gameEmbed('Blackjack',[
      {name:'🃏 Таны карт',value:`${formatHand(playerHand)} = **${pv}**`},
      {name:'🤖 Dealer',value:`${dealerHand[0].rank}${dealerHand[0].suit} **?**`},
      {name:'💵 Bet',value:`₮${shortNum(bet)}`},
    ],`${HIT} Hit | ${STAND} Stand`)]});
    await addReactions(botMsg);setupCollector(botMsg,message,userId);return botMsg;
  },
};
