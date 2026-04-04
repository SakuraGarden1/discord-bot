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

    // Discord 1024 тэмдэгтийн хязгаарт багтаах
    const unlockedText = unlocked.join('\n').slice(0, 1020) || 'Байхгүй';
    const lockedText = locked.join('\n').slice(0, 1020) || 'Байхгүй';

    const embed = new EmbedBuilder()
      .setColor(0xE8B84B)
      .setTitle('👔 Бүх ажлууд')
      .addFields(
        { name: `📊 Таны level: ${user.level}`, value: `Одоогийн ажил: ${currentJob.name}` },
        { name: `✅ Нээлттэй ажлууд (${unlocked.length})`, value: unlockedText },
        { name: `🔒 Түгжигдсэн ажлууд (${locked.length})`, value: lockedText },
      )
      .setFooter({ text: 'Ажил сонгохдоо: !job | Сонгосон ажлаараа !work хийнэ' });

    message.reply({ embeds: [embed] });
  },
};
