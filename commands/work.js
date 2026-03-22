const { getUser, saveUser, addToOwner, updateHunger } = require('../db');
const { getJob, getAvailableJobs, checkLevelUp, rand, applyTax, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 10 * 60 * 1000; // 10 минут

module.exports = {
  name: 'work',
  async execute(message) {
    const userId = message.author.id;
    let user = getUser(userId);
    user = updateHunger(user);
    const now = Date.now();
    const embed = new EmbedBuilder().setColor(0xff69b4);

    // Өлсгөлөн шалгах
    if (user.hunger <= 0) {
      embed.setTitle('😫 Өлссөн!').setDescription('Та хэтэрхий өлссөн тул ажил хийж чадахгүй байна!\n🍽️ `!cafe` дээр хоол ид!');
      saveUser(userId, user);
      return message.reply({ embeds: [embed] });
    }

    if (now - user.lastWork < COOLDOWN) {
      const left = Math.ceil((COOLDOWN - (now - user.lastWork)) / 60000);
      embed.setTitle('💼 Ажил').setDescription(`⏳ **${left} минут** дараа ажил хийж болно.`);
      return message.reply({ embeds: [embed] });
    }

    // Сонгосон ажил эсвэл default
    const availableJobs = getAvailableJobs(user.level);
    let job;
    if (user.selectedJob) {
      job = availableJobs.find(j => j.name === user.selectedJob) || getJob(user.level);
    } else {
      job = getJob(user.level);
    }

    let earned = rand(...job.pay);
    let xpGain = rand(10, 30);
    const inv = user.inventory || {};

    let boostUsed = false;
    if (inv.work_boost > 0) { earned = Math.floor(earned * 1.5); inv.work_boost--; boostUsed = true; }
    let xpBoosted = false;
    if (inv.xp_boost && inv.xp_boost > now) { xpGain *= 2; xpBoosted = true; }

    const { net, tax } = applyTax(earned);
    user.cash += net;
    user.xp += xpGain;
    user.lastWork = now;
    user.inventory = inv;
    // Ажил хийхэд өлсдөг
    user.hunger = Math.max(0, user.hunger - 10);

    const leveled = checkLevelUp(user);
    addToOwner(tax);
    saveUser(userId, user);

    const hungerBar = '🟩'.repeat(Math.floor(user.hunger / 10)) + '⬛'.repeat(10 - Math.floor(user.hunger / 10));

    embed.setTitle(`💼 ${job.name}`)
      .addFields(
        { name: '💰 Олсон', value: `₮${shortNum(earned)}`, inline: true },
        { name: '🏦 Татвар (5%)', value: `₮${shortNum(tax)}`, inline: true },
        { name: '✅ Авсан', value: `₮${shortNum(net)}`, inline: true },
        { name: `⭐ XP${xpBoosted ? ' ⚡2x' : ''}`, value: `+${xpGain}`, inline: true },
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
        { name: `🍽️ Өлсгөлөн ${Math.floor(user.hunger)}%`, value: hungerBar },
      );

    if (boostUsed) embed.setFooter({ text: `💼 Work Boost! ${inv.work_boost} удаа үлдсэн` });
    if (leveled) {
      const newJob = getJob(user.level);
      embed.addFields({ name: '🎉 LEVEL UP!', value: `Level **${user.level}** → 👔 ${newJob.name}` });
    }

    message.reply({ embeds: [embed] });
  },
};
