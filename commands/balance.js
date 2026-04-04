const { getUser } = require('../db');
const { getJob, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'balance',
  aliases: ['bal'],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const job = getJob(user.level);
    const embed = new EmbedBuilder()
      .setColor(0xE8B84B)
      .setTitle(`💰 ${target.username}-ын данс`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '💵 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
        { name: '🏦 Bank', value: `₮${shortNum(user.bank)}`, inline: true },
        { name: '💰 Нийт', value: `₮${shortNum(user.cash + user.bank)}`, inline: true },
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '👔 Ажил', value: job.name, inline: true },
      );
    message.reply({ embeds: [embed] });
  },
};
