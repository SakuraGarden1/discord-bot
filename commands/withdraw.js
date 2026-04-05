const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'withdraw',
  aliases: ['with'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const amount = args[0]?.toLowerCase() === 'all' ? user.bank : parseInt(args[0]);
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('💵 Withdraw');

    if (!amount || amount <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!with 1000` эсвэл `!with all`')] });
    if (amount > user.bank) return message.reply({ embeds: [embed.setDescription('❌ Банкинд хангалттай мөнгө байхгүй!')] });

    user.bank -= amount;
    user.cash += amount;
    saveUser(userId, user);

    embed.addFields(
      { name: '💰 Гаргасан дүн', value: `₮${shortNum(amount)}`, inline: true },
      { name: '💵 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      { name: '🏦 Bank', value: `₮${shortNum(user.bank)}`, inline: true },
    );
    message.reply({ embeds: [embed] });
  },
};
