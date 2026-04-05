const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const CHOICES = { r: '🪨 Чулуу', p: '📄 Цаас', s: '✂️ Хайч' };
const WINS = { r: 's', p: 'r', s: 'p' };

module.exports = {
  name: 'rps',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('✂️ Чулуу Цаас Хайч');

    if (!bet || bet <= 0 || !['r','p','s'].includes(choice))
      return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!rps 500 r` (r=чулуу, p=цаас, s=хайч)')] });
    if (bet > user.cash)
      return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    const botChoice = ['r','p','s'][Math.floor(Math.random() * 3)];
    user.cash -= bet;

    let result, moneyText;
    if (choice === botChoice) {
      user.cash += bet;
      result = '🤝 Тэнцлээ!';
      moneyText = 'Мөнгө буцлаа';
    } else if (WINS[choice] === botChoice) {
      user.cash += bet * 2;
      result = '🏆 Таны хожлоо!';
      moneyText = `+₮${shortNum(bet)}`;
    } else {
      result = '😔 Bot хожлоо!';
      moneyText = `-₮${shortNum(bet)}`;
    }

    embed.addFields(
      { name: '👤 Тань', value: CHOICES[choice], inline: true },
      { name: '🤖 Bot', value: CHOICES[botChoice], inline: true },
      { name: result, value: moneyText, inline: true },
      { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
    );
    saveUser(userId, user);
    message.reply({ embeds: [embed] });
  },
};
