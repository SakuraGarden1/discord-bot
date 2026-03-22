const { getUser, saveUser } = require('../db');
const { checkLevelUp, getJob, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 24 * 60 * 60 * 1000;

module.exports = {
  name: 'daily',
  async execute(message) {
    const userId = message.author.id;
    const user = getUser(userId);
    const now = Date.now();

    if (!user.lastDaily) user.lastDaily = 0;

    if (now - user.lastDaily < COOLDOWN) {
      const left = Math.ceil((COOLDOWN - (now - user.lastDaily)) / 3600000);
      const mins = Math.ceil((COOLDOWN - (now - user.lastDaily)) / 60000) % 60;
      const embed = new EmbedBuilder()
        .setColor(0xff69b4)
        .setTitle('🎁 Өдрийн урамшуулал')
        .setDescription(`⏳ **${left} цаг ${mins} минут** дараа дахин авч болно.`);
      return message.reply({ embeds: [embed] });
    }

    if (!user.dailyStreak) user.dailyStreak = 0;
    const yesterday = now - 48 * 60 * 60 * 1000;
    user.dailyStreak = user.lastDaily > yesterday ? user.dailyStreak + 1 : 1;

    const base = 500 + user.level * 50;
    const streakBonus = Math.min(user.dailyStreak * 100, 2000);
    const total = base + streakBonus;

    user.cash += total;
    user.xp += 20;
    user.lastDaily = now;

    const leveled = checkLevelUp(user);
    saveUser(userId, user);

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('🎁 Өдрийн урамшуулал!')
      .addFields(
        { name: '💵 Үндсэн', value: `₮${shortNum(base)}`, inline: true },
        { name: `🔥 Streak (${user.dailyStreak} өдөр)`, value: `+₮${shortNum(streakBonus)}`, inline: true },
        { name: '💰 Нийт авсан', value: `₮${shortNum(total)}`, inline: true },
        { name: '⭐ XP', value: '+20', inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );

    if (user.dailyStreak >= 7) embed.setFooter({ text: '🏅 7 өдрийн streak! Гайхалтай!' });
    if (leveled) {
      const job = getJob(user.level);
      embed.addFields({ name: '🎉 LEVEL UP!', value: `Level **${user.level}** → 👔 ${job.name}` });
    }

    message.reply({ embeds: [embed] });
  },
};
