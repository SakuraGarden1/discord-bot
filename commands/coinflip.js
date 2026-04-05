const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  aliases: ['cf'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const raw = args[1]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('🪙 Coinflip');
    const choice = raw === 'h' ? 'heads' : raw === 't' ? 'tails' : raw;

    if (!bet || bet <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!cf 500 h` эсвэл `!cf 500 t`')] });
    if (!['heads','tails'].includes(choice)) return message.reply({ embeds: [embed.setDescription('❌ `h` (heads) эсвэл `t` (tails)')] });
    if (bet > user.cash) return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const emoji = result === 'heads' ? '👑' : '🔵';
    user.cash -= bet;

    if (result === choice) {
      user.cash += bet * 2;
      embed.addFields(
        { name: `${emoji} ${result.toUpperCase()}`, value: '✅ Таны таавар зөв!', inline: true },
        { name: '💰 Хожлоо', value: `+₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    } else {
      user.stress = Math.min(100, (user.stress||0) + 5);
      embed.addFields(
        { name: `${emoji} ${result.toUpperCase()}`, value: '❌ Таны таавар буруу!', inline: true },
        { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    }
    saveUser(userId, user);
    message.reply({ embeds: [embed] });
  },
};
