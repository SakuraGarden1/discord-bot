const { getUser } = require('../db');
const { JOBS, getJob, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'jobs',
  async execute(message) {
    const user = getUser(message.author.id);
    const currentJob = getJob(user.level);

    const unlocked = [];
    const locked = [];

    for (const job of JOBS) {
      if (user.level >= job.min) {
        unlocked.push(`✅ **${job.name}** — ₮${shortNum(job.pay[0])}-₮${shortNum(job.pay[1])} | Lv.${job.min}+`);
      } else {
        locked.push(`🔒 **${job.name}** — ₮${shortNum(job.pay[0])}-₮${shortNum(job.pay[1])} | Lv.${job.min}+`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0xFFC0CB)
      .setTitle('👔 Бүх ажлууд')
      .addFields(
        { name: `📊 Таны level: ${user.level} | ${currentJob.name}`, value: '\u200b' },
        { name: `✅ Нээлттэй (${unlocked.length})`, value: unlocked.join('\n').slice(0, 1020) || 'Байхгүй' },
        { name: `🔒 Түгжигдсэн (${locked.length})`, value: locked.join('\n').slice(0, 1020) || 'Байхгүй' },
      )
      .setFooter({ text: 'Ажил сонгохдоо: !job' });

    message.reply({ embeds: [embed] });
  },
};
