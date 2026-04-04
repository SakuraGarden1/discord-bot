const { getUser, saveUser, updateHunger } = require('../db');
const { getJob, getAvailableJobs, checkLevelUp, rand, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 10 * 60 * 1000;

module.exports = {
  name: 'work',
  async execute(message) {
    const userId = message.author.id;
    let user = getUser(userId);
    user = updateHunger(user);
    const now = Date.now();
    const embed = new EmbedBuilder().setColor(0xE8B84B);

    if ((user.drunk || 0) >= 3) {
      embed.setTitle('🥴 Согтсон!').setDescription(`Та **${user.drunk.toFixed(1)} бүхэл** согтсон!\n🍺 Hangover Cure ав эсвэл хүлээ.`);
      return message.reply({ embeds: [embed] });
    }

    if (user.hunger <= 0) {
      embed.setTitle('😫 Өлссөн!').setDescription('`!cafe` дээр хоол ид!');
      saveUser(userId, user);
      return message.reply({ embeds: [embed] });
    }

    // VIP Pass cooldown буурна
    const cooldown = user.inventory?.vip_pass ? COOLDOWN * 0.7 : COOLDOWN;
    if (now - user.lastWork < cooldown) {
      const left = Math.ceil((cooldown - (now - user.lastWork)) / 60000);
      embed.setTitle('💼 Ажил').setDescription(`⏳ **${left} минут** дараа ажил хийж болно.`);
      return message.reply({ embeds: [embed] });
    }

    const availableJobs = getAvailableJobs(user.level);
    let job = user.selectedJob ? availableJobs.find(j => j.name === user.selectedJob) || getJob(user.level) : getJob(user.level);

    let earned = rand(...job.pay);
    let xpGain = rand(10, 30);
    const inv = user.inventory || {};

    if (inv.vip_pass) { earned = Math.floor(earned * 1.3); xpGain = Math.floor(xpGain * 1.3); }
    if (inv.double_bet_ticket) { earned *= 2; inv.double_bet_ticket = false; }
    let boostUsed = false;
    if (inv.work_boost > 0) { earned = Math.floor(earned * 1.5); inv.work_boost--; boostUsed = true; }
    let xpBoosted = false;
    if (inv.xp_boost && inv.xp_boost > now) { xpGain *= 2; xpBoosted = true; }

    user.cash += earned;
    user.xp += xpGain;
    user.lastWork = now;
    user.inventory = inv;
    user.hunger = Math.max(0, user.hunger - 10);
    user.stress = Math.min(100, (user.stress || 0) + 5);

    const leveled = checkLevelUp(user);
    saveUser(userId, user);

    const newJob = getJob(user.level);
    const hungerBar = '🟩'.repeat(Math.floor(user.hunger / 10)) + '⬛'.repeat(10 - Math.floor(user.hunger / 10));

    embed.setTitle(`💼 ${job.name}`)
      .addFields(
        { name: '💰 Авсан', value: `₮${shortNum(earned)}`, inline: true },
        { name: `⭐ XP${xpBoosted ? ' ⚡2x' : ''}`, value: `+${xpGain}`, inline: true },
        { name: '😤 Stress', value: `${user.stress}/100`, inline: true },
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
        { name: `🍽️ Өлсгөлөн ${Math.floor(user.hunger)}%`, value: hungerBar },
      );

    if (boostUsed) embed.setFooter({ text: `💼 Work Boost! ${inv.work_boost} удаа үлдсэн` });
    if (leveled) embed.addFields({ name: '🎉 LEVEL UP!', value: `Level **${user.level}** → 👔 ${newJob.name}` });
    if (user.stress >= 80) embed.addFields({ name: '⚠️ Stress өндөр!', value: '🚬 `!cigarshop` дээр тамхи тат!' });

    message.reply({ embeds: [embed] });
  },
};
