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
    if (inv.bank_shield) items.push({ name: '🏦 Bank Shield', value: 'Bank rob-оос хамгаална', inline: true });
    if (inv.police_protect) items.push({ name: '👮 Police Protection', value: 'Rob хийхэд торгууль 30% магадлалтай', inline: true });
    if (inv.xp_boost && inv.xp_boost > Date.now()) {
      const left = Math.ceil((inv.xp_boost - Date.now()) / 60000);
      items.push({ name: '⚡ XP Boost', value: `${left} минут үлдсэн`, inline: true });
    }
    if (inv.lucky_charm) items.push({ name: '🎰 Lucky Charm', value: 'Slot давуу магадлал', inline: true });
    if (inv.work_boost > 0) items.push({ name: '💼 Work Boost', value: `${inv.work_boost} удаа үлдсэн`, inline: true });
    if (inv.money_printer) items.push({ name: '💰 Money Printer', value: '1 цаг тутам мөнгө generate', inline: true });
    if (inv.double_bet_ticket) items.push({ name: '🎫 Double Bet Ticket', value: 'Дараагийн work 2x цалин', inline: true });
    if (inv.vip_pass) items.push({ name: '💎 VIP Pass', value: 'Cooldown -30%, reward +30%', inline: true });
    if (inv.supreme_badge) items.push({ name: '🏅 SUPREME Badge', value: 'Profile дээр тусах', inline: true });
    if (inv.luxury_drink_ticket) items.push({ name: '🎟️ Luxury Drink Ticket', value: 'Premium архи 50% хямд', inline: true });
    if (inv.ring_silver) items.push({ name: '💍 Мөнгөн бөгж', value: `${inv.ring_silver} ширхэг`, inline: true });
    if (inv.ring_gold) items.push({ name: '💎 Алтан бөгж', value: `${inv.ring_gold} ширхэг`, inline: true });
    if (inv.ring_diamond) items.push({ name: '👑 Алмазан бөгж', value: `${inv.ring_diamond} ширхэг`, inline: true });
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
