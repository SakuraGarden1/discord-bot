const { EmbedBuilder } = require('discord.js');
const { shortNum } = require('../economy');

const SHOP_ITEMS = [
  { id: 1, name: '🛡️ Rob Shield',      price: 5000,     description: '1 удаа cash хулгайгаас хамгаална',  key: 'rob_shield' },
  { id: 2, name: '🏦 Bank Shield',      price: 8000,     description: '1 удаа bank rob-оос хамгаална',      key: 'bank_shield' },
  { id: 3, name: '⚡ XP Boost (1hr)',  price: 8000,     description: '1 цагийн турш XP 2x',               key: 'xp_boost' },
  { id: 4, name: '🎰 Lucky Charm',     price: 12000,    description: 'Slot machine-д 10 удаа lucky',        key: 'lucky_charm' },
  { id: 5, name: '💼 Work Boost',      price: 15000,    description: '5 удаа ажлын цалин 1.5x',            key: 'work_boost', count: 5 },
  { id: 6, name: '🏧 Bank Expand',     price: 50000,    description: 'Bank хязгаар 2x нэмэгдэнэ',          key: 'bank_expand' },
  { id: 7, name: '💍 Мөнгөн бөгж',    price: 5000000,  description: 'Гэрлэхэд шаардлагатай (Silver)',      key: 'ring_silver' },
  { id: 8, name: '💎 Алтан бөгж',     price: 10000000, description: 'Тансаг гэрлэлтийн бөгж (Gold)',       key: 'ring_gold' },
  { id: 9, name: '👑 Алмазан бөгж',   price: 50000000, description: 'Хамгийн тансаг бөгж (Diamond)',       key: 'ring_diamond' },
];

module.exports = {
  name: 'shop',
  SHOP_ITEMS,
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('🏪 ДЭЛГҮҮР')
      .addFields(
        { name: '🛡️ Хамгаалалт', value: SHOP_ITEMS.slice(0, 2).map(i => `\`${i.id}\` ${i.name} — ₮${shortNum(i.price)}\n↳ ${i.description}`).join('\n') },
        { name: '⚙️ Boost items', value: SHOP_ITEMS.slice(2, 6).map(i => `\`${i.id}\` ${i.name} — ₮${shortNum(i.price)}\n↳ ${i.description}`).join('\n') },
        { name: '💍 Бөгж (гэрлэлт)', value: SHOP_ITEMS.slice(6).map(i => `\`${i.id}\` ${i.name} — ₮${shortNum(i.price)}\n↳ ${i.description}`).join('\n') },
      )
      .setFooter({ text: 'Худалдаж авахдаа: !buy <дугаар> | Lucky Charm ашиглахдаа: !use luckycharm' });
    message.reply({ embeds: [embed] });
  },
};
