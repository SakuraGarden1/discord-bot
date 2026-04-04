const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

const SHOP_ITEMS = [
  { id: 1, name: '🛡️ Rob Shield',     price: 5000,     key: 'rob_shield' },
  { id: 2, name: '🏦 Bank Shield',     price: 8000,     key: 'bank_shield' },
  { id: 3, name: '👮 Police Protection', price: 5000000,  key: 'police_protect' },
  { id: 4, name: '⚡ XP Boost (1hr)',  price: 8000,     key: 'xp_boost' },
  { id: 5, name: '🎰 Lucky Charm',     price: 12000,    key: 'lucky_charm', count: 10 },
  { id: 6, name: '💼 Work Boost',     price: 15000,    key: 'work_boost', count: 5 },
  { id: 7, name: '🏧 Bank Expand',     price: 50000,    key: 'bank_expand' },
  { id: 8, name: '💰 Money Printer',  price: 10000000, key: 'money_printer' },
  { id: 9, name: '🎫 Double Bet Ticket', price: 10000000, key: 'double_bet_ticket' },
  { id: 10, name: '💎 VIP Pass',      price: 30000000, key: 'vip_pass' },
  { id: 11, name: '🏅 SUPREME Badge', price: 50000000, key: 'supreme_badge' },
  { id: 12, name: '🎟️ Luxury Drink Ticket', price: 1000000, key: 'luxury_drink_ticket' },
  { id: 13, name: '🍺 Hangover Cure',       price: 100000,   key: 'hangover_cure' },
  { id: 14, name: '💊 Anti-Addiction Pill', price: 100000,   key: 'anti_addiction' },
  { id: 15, name: '🍔 Burger',              price: 10000,    key: 'food_burger',  hunger: 20 },
  { id: 16, name: '🍕 Pizza',               price: 30000,    key: 'food_pizza',   hunger: 40 },
  { id: 17, name: '🥩 Steak',               price: 100000,   key: 'food_steak',   hunger: 80 },
  { id: 18, name: '✨ Golden Meal',         price: 1000000,  key: 'food_golden',  hunger: 100 },
  { id: 19, name: '💍 Мөнгөн бөгж',        price: 5000000,  key: 'ring_silver' },
  { id: 20, name: '💎 Алтан бөгж',         price: 10000000, key: 'ring_gold' },
  { id: 21, name: '👑 Алмазан бөгж',       price: 50000000, key: 'ring_diamond' },
];

const ONE_TIME = [
  'rob_shield',
  'bank_shield',
  'police_protect',
  'bank_expand',
  'money_printer',
  'vip_pass',
  'supreme_badge',
  'luxury_drink_ticket',
];
const STACKABLE = ['lucky_charm', 'work_boost', 'ring_silver', 'ring_gold', 'ring_diamond'];

module.exports = {
  name: 'buy',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const itemId = parseInt(args[0]);
    const item = SHOP_ITEMS.find(i => i.id === itemId);

    if (!item) return message.reply(`❌ Зөв дугаар оруул (1-21). \`!shop\` гэж харна уу.`);
    if (!user.inventory) user.inventory = {};
    if (user.cash < item.price) {
      return message.reply(
        `❌ Мөнгө хүрэлцэхгүй!\n💵 Cash: ₮${shortNum(user.cash)}\n💰 Шаардлагатай: ₮${shortNum(item.price)}`
      );
    }

    // Давхар авах шалгалт
    if (ONE_TIME.includes(item.key) && user.inventory[item.key]) {
      return message.reply(`❌ **${item.name}** аль хэдийн байна!`);
    }
    if (item.key === 'bank_expand' && user.bankExpanded) {
      return message.reply(`❌ **${item.name}** аль хэдийн байна!`);
    }

    // XP Boost — хугацаа дуусаагүй байвал л татгалзана
    if (item.key === 'xp_boost' && user.inventory.xp_boost && user.inventory.xp_boost > Date.now()) {
      const left = Math.ceil((user.inventory.xp_boost - Date.now()) / 60000);
      return message.reply(`❌ XP Boost идэвхтэй! **${left} минут** үлдсэн.`);
    }

    user.cash -= item.price;

    // Шууд хэрэглэх items
    if (item.hunger) {
      user.hunger = Math.min(100, (user.hunger || 0) + item.hunger);
      if (item.key === 'food_golden') user.stress = Math.max(0, (user.stress || 0) - 20);
      saveUser(userId, user);
      return message.reply(`✅ **${item.name}** идлээ!\n🍽️ Өлсгөлөн: ${Math.floor(user.hunger)}%\n💵 Cash: ₮${shortNum(user.cash)}`);
    }
    if (item.key === 'hangover_cure') {
      user.drunk = Math.max(0, (user.drunk || 0) - 3);
      user.lastDrink = Date.now();
      user.lastDrunkDecay = Date.now();
      saveUser(userId, user);
      return message.reply(`✅ Hangover Cure уулаа!\n🥴 Согтолт: ${user.drunk.toFixed(1)}/10\n💵 Cash: ₮${shortNum(user.cash)}`);
    }
    if (item.key === 'anti_addiction') {
      user.addiction = false;
      user.drinkCount = 0;
      saveUser(userId, user);
      return message.reply(`✅ Anti-Addiction Pill уулаа!\n🚫 Архины addiction арилгагдлаа!\n💵 Cash: ₮${shortNum(user.cash)}`);
    }

    // Inventory-д нэмэх
    if (item.key === 'work_boost') user.inventory.work_boost = (user.inventory.work_boost || 0) + (item.count || 1);
    else if (item.key === 'lucky_charm') user.inventory.lucky_charm = (user.inventory.lucky_charm || 0) + (item.count || 10);
    else if (item.key === 'xp_boost') user.inventory.xp_boost = Date.now() + 3600000;
    else if (item.key === 'bank_expand') user.bankExpanded = true;
    else if (STACKABLE.includes(item.key) && !['lucky_charm', 'work_boost'].includes(item.key)) {
      user.inventory[item.key] = (user.inventory[item.key] || 0) + 1;
    } else {
      user.inventory[item.key] = true;
    }

    saveUser(userId, user);
    message.reply(`✅ **${item.name}** худалдаж авлаа!\n💵 Үлдэгдэл: ₮${shortNum(user.cash)}`);
  },
};
