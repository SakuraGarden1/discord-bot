const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'deposit',
  aliases: ['dep'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const amount = args[0]?.toLowerCase() === 'all' ? user.cash : parseInt(args[0]);
    const embed = new EmbedBuilder().setColor(0xE8B84B).setTitle('🏦 Deposit');

    if (!amount || amount <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!dep 1000` эсвэл `!dep all`')] });
    if (amount > user.cash) return message.reply({ embeds: [embed.setDescription('❌ Хангалттай cash байхгүй!')] });

    user.cash -= amount;
    user.bank += amount;
    saveUser(userId, user);

    embed.addFields(
      { name: '💰 Хийсэн дүн', value: `₮${shortNum(amount)}`, inline: true },
      { name: '💵 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      { name: '🏦 Bank', value: `₮${shortNum(user.bank)}`, inline: true },
    );
    message.reply({ embeds: [embed] });
  },
};
