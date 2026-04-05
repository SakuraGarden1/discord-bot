const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dice',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const guess = parseInt(args[1]);
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('🎲 Dice');

    if (!bet || bet <= 0 || !guess || guess < 1 || guess > 6)
      return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!dice 500 4` (1-6 дугаар таах)')] });
    if (bet > user.cash)
      return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    const roll = Math.floor(Math.random() * 6) + 1;
    const emojis = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    user.cash -= bet;

    if (roll === guess) {
      const win = bet * 5;
      user.cash += win;
      embed.addFields(
        { name: `${emojis[roll-1]} Үр дүн: ${roll}`, value: '🎯 Таны таавар зөв!', inline: false },
        { name: '💰 Хожлоо', value: `+₮${shortNum(win)} (x5)`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    } else {
      embed.addFields(
        { name: `${emojis[roll-1]} Үр дүн: ${roll}`, value: `❌ Таны таавар: ${guess}`, inline: false },
        { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    }
    saveUser(userId, user);
    message.reply({ embeds: [embed] });
  },
};
