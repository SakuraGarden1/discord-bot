const { getUser, updateHunger } = require('../db');
const { getJob, xpForNextLevel, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'profile',
  aliases: ['pro'],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    let user = getUser(target.id);
    user = updateHunger(user);
    const hasSupremeBadge = !!user.inventory?.supreme_badge;
    const job = getJob(user.level);
    const nextXP = xpForNextLevel(user.level);
    const progress = Math.floor((user.xp / nextXP) * 10);
    const bar = '█'.repeat(progress) + '░'.repeat(10 - progress);
    const hungerBar = '🟩'.repeat(Math.floor(user.hunger / 10)) + '⬛'.repeat(10 - Math.floor(user.hunger / 10));
    const streak = user.dailyStreak || 0;

    let marriedText = '💔 Гэрлээгүй';
    if (user.married) {
      try {
        const m = await message.guild.members.fetch(user.married);
        marriedText = `💑 ${m.displayName}`;
      } catch { marriedText = '💑 Гэрлэсэн'; }
    }

    const embed = new EmbedBuilder()
      // SUPREME badge идэвхтэй үед profile-н өнгийг "solid" буюу өөрөөр гаргана.
      .setColor(hasSupremeBadge ? 0xFFD700 : 0xff69b4)
      .setTitle(`👤 ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '🔥 Streak', value: `${streak} өдөр`, inline: true },
        { name: '👔 Ажил', value: job.name, inline: true },
        { name: '💍 Гэрлэлт', value: marriedText, inline: true },
        { name: '⭐ XP', value: `\`[${bar}]\` ${user.xp}/${nextXP}` },
        { name: '💵 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
        { name: '🏦 Bank', value: `₮${shortNum(user.bank)}`, inline: true },
        { name: '💰 Нийт', value: `₮${shortNum(user.cash + user.bank)}`, inline: true },
        { name: `🍽️ Өлсгөлөн ${Math.floor(user.hunger)}%`, value: hungerBar },
      );

    if (hasSupremeBadge) {
      embed.addFields({ name: '🏅 SUPREME Badge', value: 'Идэвхтэй', inline: true });
    }
    message.reply({ embeds: [embed] });
  },
};
