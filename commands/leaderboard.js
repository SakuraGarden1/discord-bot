const { getAllUsers } = require('../db');
const { getJob, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb'],
  async execute(message) {
    const users = getAllUsers();
    const sorted = Object.entries(users)
      .map(([id, u]) => ({ id, ...u, total: u.cash + u.bank }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    if (sorted.length === 0) return message.reply('📊 Leaderboard хоосон.');

    const medals = ['🥇', '🥈', '🥉'];
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('🏆 LEADERBOARD');

    const lines = [];
    for (let i = 0; i < sorted.length; i++) {
      const u = sorted[i];
      const medal = medals[i] || `**${i + 1}.**`;
      const job = getJob(u.level);
      let username;
      try {
        const member = await message.guild.members.fetch(u.id);
        username = member.displayName;
      } catch { username = `User#${u.id.slice(-4)}`; }
      lines.push(`${medal} **${username}** — ₮${shortNum(u.total)} | Lv.${u.level} ${job.name}`);
    }

    embed.setDescription(lines.join('\n'));
    message.reply({ embeds: [embed] });
  },
};
