const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const SYMBOLS = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'];
function spin(lucky = false) {
  return [0,1,2].map(() => {
    if (lucky && Math.random() < 0.15) return SYMBOLS[Math.floor(Math.random()*3)+3];
    return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
  });
}

module.exports = {
  name: 'slot',
  aliases: ['sl'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('🎰 Slot Machine');

    if (!bet || bet <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!slot 500`')] });
    if (bet > user.cash) return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    const inv = user.inventory || {};
    let luckyActive = false;
    if (inv.lucky_charm_active > 0) { luckyActive = true; inv.lucky_charm_active--; user.inventory = inv; }

    const reels = spin(luckyActive);
    user.cash -= bet;

    let multiplier = 0, resultText = '';
    if (reels[0]===reels[1] && reels[1]===reels[2]) {
      if (reels[0]==='💎') multiplier=10;
      else if (reels[0]==='7️⃣') multiplier=7;
      else if (reels[0]==='⭐') multiplier=5;
      else multiplier=3;
      resultText='🎉 JACKPOT!';
    } else if (reels[0]===reels[1]||reels[1]===reels[2]||reels[0]===reels[2]) {
      multiplier=1.5; resultText='✨ Хоёр таарлаа!';
    } else {
      resultText='💨 Хожигдлоо';
    }

    embed.addFields({ name: `${luckyActive?'🍀 Lucky! ':''}Үр дүн`, value: reels.join('  ') });

    if (multiplier > 0) {
      const win = Math.floor(bet * multiplier);
      user.cash += win;
      embed.addFields(
        { name: resultText, value: `x${multiplier}`, inline: true },
        { name: '💰 Хожлоо', value: `+₮${shortNum(win-bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    } else {
      user.stress = Math.min(100, (user.stress||0) + 5);
      embed.addFields(
        { name: resultText, value: '—', inline: true },
        { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    }
    if (luckyActive) embed.setFooter({ text: `🍀 Lucky Charm: ${inv.lucky_charm_active} удаа үлдсэн` });
    saveUser(userId, user);
    message.reply({ embeds: [embed] });
  },
};
