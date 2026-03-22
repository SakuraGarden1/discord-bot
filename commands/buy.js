const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

const SHOP_ITEMS = [
  { id: 1, name: '🛡️ Rob Shield',     price: 5000,     key: 'rob_shield' },
  { id: 2, name: '🏦 Bank Shield',     price: 8000,     key: 'bank_shield' },
  { id: 3, name: '⚡ XP Boost (1hr)', price: 8000,     key: 'xp_boost' },
  { id: 4, name: '🎰 Lucky Charm',    price: 12000,    key: 'lucky_charm', count: 10 },
  { id: 5, name: '💼 Work Boost',     price: 15000,    key: 'work_boost', count: 5 },
  { id: 6, name: '🏧 Bank Expand',    price: 50000,    key: 'bank_expand' },
  { id: 7, name: '💍 Мөнгөн бөгж',   price: 5000000,  key: 'ring_silver' },
  { id: 8, name: '💎 Алтан бөгж',    price: 10000000, key: 'ring_gold' },
  { id: 9, name: '👑 Алмазан бөгж',  price: 50000000, key: 'ring_diamond' },
];

module.exports = {
  name: 'buy',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const itemId = parseInt(args[0]);
    const item = SHOP_ITEMS.find(i => i.id === itemId);

    if (!item) return message.reply('❌ Зөв дугаар оруул. `!shop` гэж харна уу.');
    if (!user.inventory) user.inventory = {};
    if (user.cash < item.price) return message.reply(`❌ Мөнгө хүрэлцэхгүй! Cash: ₮${shortNum(user.cash)} / Шаардлагатай: ₮${shortNum(item.price)}`);

    if (['rob_shield', 'bank_shield', 'xp_boost', 'bank_expand'].includes(item.key) && user.inventory[item.key]) {
      return message.reply(`❌ **${item.name}** аль хэдийн байна!`);
    }

    user.cash -= item.price;

    if (item.key === 'work_boost') user.inventory.work_boost = (user.inventory.work_boost || 0) + (item.count || 1);
    else if (item.key === 'xp_boost') user.inventory.xp_boost = Date.now() + 3600000;
    else if (item.key === 'bank_expand') user.bankExpanded = true;
    else if (item.key === 'lucky_charm') user.inventory.lucky_charm = (user.inventory.lucky_charm || 0) + (item.count || 10);
    else if (['ring_silver', 'ring_gold', 'ring_diamond'].includes(item.key)) user.inventory[item.key] = (user.inventory[item.key] || 0) + 1;
    else user.inventory[item.key] = true;

    saveUser(userId, user);
    message.reply(`✅ **${item.name}** худалдаж авлаа!\n💵 Үлдэгдэл: ₮${shortNum(user.cash)}`);
  },
};
