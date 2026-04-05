const { getUser, saveUser } = require('../db');
const { getJob, getAvailableJobs, checkLevelUp, rand, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 5 * 60 * 1000; // 5 минут

module.exports = {
  name: 'work',
  async execute(message) {
    const userId = message.author.id;
    const user = getUser(userId);
    const now = Date.now();
    const embed = new EmbedBuilder().setColor(0xFFC0CB);

    const cooldown = user.inventory?.vip_pass ? COOLDOWN * 0.7 : COOLDOWN;
    if (now - user.lastWork < cooldown) {
      const left = Math.ceil((cooldown - (now - user.lastWork)) / 60000);
      embed.setTitle('💼 Ажил').setDescription(`⏳ **${left} минут** дараа ажил хийж болно.`);
      return message.reply({ embeds: [embed] });
    }

    const availableJobs = getAvailableJobs(user.level);
    const job = user.selectedJob
      ? availableJobs.find(j => j.name === user.selectedJob) || getJob(user.level)
      : getJob(user.level);

    let earned = rand(...job.pay);
    let xpGain = rand(10, 30);
    const inv = user.inventory || {};
    const now2 = Date.now();

    if (inv.vip_pass) { earned = Math.floor(earned * 1.3); xpGain = Math.floor(xpGain * 1.3); }
    if (inv.double_bet_ticket) { earned *= 2; inv.double_bet_ticket = false; }

    let boostUsed = false;
    if (inv.work_boost > 0) { earned = Math.floor(earned * 1.5); inv.work_boost--; boostUsed = true; }

    let xpBoosted = false;
    if (inv.xp_boost && inv.xp_boost > now2) {
      xpGain *= 2;
      xpBoosted = true;
    } else if (inv.xp_boost && inv.xp_boost <= now2) {
      // Auto expire XP boost
      delete inv.xp_boost;
    }

    user.cash += earned;
    user.xp += xpGain;
    user.lastWork = now;
    user.inventory = inv;

    const leveled = checkLevelUp(user);
    saveUser(userId, user);

    const newJob = getJob(user.level);
    embed.setTitle(`💼 ${job.name}`)
      .addFields(
        { name: '💰 Авсан', value: `₮${shortNum(earned)}`, inline: true },
        { name: `⭐ XP${xpBoosted ? ' ⚡2x' : ''}`, value: `+${xpGain}`, inline: true },
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );

    if (boostUsed) embed.setFooter({ text: `💼 Work Boost! ${inv.work_boost} удаа үлдсэн` });
    if (leveled) embed.addFields({ name: '🎉 LEVEL UP!', value: `Level **${user.level}** → 👔 ${newJob.name}` });

    message.reply({ embeds: [embed] });
  },
};
