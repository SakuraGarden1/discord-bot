const { getUser, saveUser } = require('../db');
const { getAvailableJobs } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'selectjob',
  aliases: ['job'],
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const jobs = getAvailableJobs(user.level);
    const embed = new EmbedBuilder().setColor(0xE8B84B).setTitle('👔 Ажил сонгох');

    if (!args[0]) {
      embed.addFields(
        { name: `📊 Таны level: ${user.level}`, value: 'Дараах ажлуудаас сонгоно уу:' },
        ...jobs.map((j, i) => ({
          name: `\`${i + 1}\` ${j.name}`,
          value: `💰 ₮${j.pay[0].toLocaleString()}–₮${j.pay[1].toLocaleString()} | Level ${j.min}+`,
          inline: true,
        }))
      ).setFooter({ text: 'Сонгохдоо: !job <дугаар>' });
      return message.reply({ embeds: [embed] });
    }

    const idx = parseInt(args[0]) - 1;
    if (isNaN(idx) || idx < 0 || idx >= jobs.length) {
      return message.reply({ embeds: [embed.setDescription('❌ Зөв дугаар оруул.')] });
    }

    const selected = jobs[idx];
    user.selectedJob = selected.name;
    saveUser(userId, user);

    embed.setDescription(`✅ **${selected.name}** ажлыг сонгов!\n💰 Цалин: ₮${selected.pay[0].toLocaleString()}–₮${selected.pay[1].toLocaleString()}`);
    message.reply({ embeds: [embed] });
  },
};
