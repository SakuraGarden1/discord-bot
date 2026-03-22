const { getUser } = require('../db');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  async execute(message) {
    const user = getUser(message.author.id);
    const inv = user.inventory || {};
    const items = [];

    if (inv.rob_shield) items.push({ name: '🛡️ Rob Shield', value: 'Хулгайгаас хамгаалагдсан', inline: true });
    if (inv.xp_boost && inv.xp_boost > Date.now()) {
      const left = Math.ceil((inv.xp_boost - Date.now()) / 60000);
      items.push({ name: '⚡ XP Boost', value: `${left} минут үлдсэн`, inline: true });
    }
    if (inv.lucky_charm) items.push({ name: '🎰 Lucky Charm', value: 'Slot давуу магадлал', inline: true });
    if (inv.work_boost > 0) items.push({ name: '💼 Work Boost', value: `${inv.work_boost} удаа үлдсэн`, inline: true });
    if (user.bankExpanded) items.push({ name: '🏦 Bank Expand', value: 'Идэвхтэй', inline: true });

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`🎒 ${message.author.username}-ын Inventory`)
      .setThumbnail(message.author.displayAvatarURL());

    if (items.length === 0) {
      embed.setDescription('Inventory хоосон байна.\n🏪 Дэлгүүр харахад: `!shop`');
    } else {
      embed.addFields(items);
    }

    message.reply({ embeds: [embed] });
  },
};
