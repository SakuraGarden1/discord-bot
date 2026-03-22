const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'highlow',
  aliases: ['hl'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('🃏 High Low');

    if (!bet || bet <= 0 || !['h','l'].includes(choice))
      return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!hl 500 h` (h=өндөр >50, l=доогуур <50)')] });
    if (bet > user.cash)
      return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    const num = Math.floor(Math.random() * 100) + 1;
    const isHigh = num > 50;
    const won = (choice === 'h' && isHigh) || (choice === 'l' && !isHigh);
    user.cash -= bet;

    if (won) {
      user.cash += bet * 2;
      embed.addFields(
        { name: `🎲 Тоо: ${num}`, value: `✅ Таны таавар зөв! (${choice === 'h' ? 'Өндөр' : 'Доогуур'})` },
        { name: '💰 Хожлоо', value: `+₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    } else {
      embed.addFields(
        { name: `🎲 Тоо: ${num}`, value: `❌ Таны таавар буруу!` },
        { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    }
    saveUser(userId, user);
    message.reply({ embeds: [embed] });
  },
};
