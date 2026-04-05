const { getUser } = require('../db');
const { getJob, xpForNextLevel, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'profile',
  aliases: ['pro'],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const job = getJob(user.level);
    const nextXP = xpForNextLevel(user.level);
    const progress = Math.floor((user.xp / nextXP) * 10);
    const bar = '█'.repeat(progress) + '░'.repeat(10 - progress);
    const streak = user.dailyStreak || 0;

    let marriedText = '💔 Гэрлээгүй';
    if (user.married) {
      try {
        const m = await message.guild.members.fetch(user.married);
        marriedText = `💑 ${m.displayName}`;
      } catch { marriedText = '💑 Гэрлэсэн'; }
    }

    const inv = user.inventory || {};
    const badges = [];
    if (inv.supreme_badge) badges.push('🏅 SUPREME');
    if (inv.vip_pass) badges.push('💎 VIP');

    const embed = new EmbedBuilder()
      .setColor(0xFFC0CB)
      .setTitle(`🌸 ${target.username}${badges.length ? ' ' + badges.join(' ') : ''}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '👔 Ажил', value: job.name, inline: true },
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '🔥 Streak', value: `${streak} өдөр`, inline: true },
        { name: '⭐ XP', value: `\`[${bar}]\` ${user.xp}/${nextXP}` },
        { name: '💵 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
        { name: '🏦 Bank', value: `₮${shortNum(user.bank)}`, inline: true },
        { name: '💰 Нийт', value: `₮${shortNum(user.cash + user.bank)}`, inline: true },
        { name: '💍 Гэрлэлт', value: marriedText, inline: true },
      );
    message.reply({ embeds: [embed] });
  },
};
