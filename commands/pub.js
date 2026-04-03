const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const DRINKS = [
  { id: 1,  name: '🍺 Cheap Beer',          price: 10000,    drunk: 1.5, tier: 'cheap' },
  { id: 2,  name: '🥃 Street Vodka',        price: 15000,    drunk: 1.8, tier: 'cheap' },
  { id: 3,  name: '🍶 Plastic Bottle Soju', price: 12000,    drunk: 1.6, tier: 'cheap' },
  { id: 4,  name: '🍷 Low Wine',            price: 18000,    drunk: 1.3, tier: 'cheap' },
  { id: 5,  name: '🍹 Cheap Rum',           price: 20000,    drunk: 1.7, tier: 'cheap' },
  { id: 6,  name: '🍺 Old Beer',            price: 10000,    drunk: 1.4, tier: 'cheap' },
  { id: 7,  name: '🥃 Dark Cheap Whiskey',  price: 25000,    drunk: 1.9, tier: 'cheap' },
  { id: 8,  name: '🍸 Strong Cheap Gin',    price: 22000,    drunk: 2.0, tier: 'cheap' },
  { id: 9,  name: '🍺 Local Brew',          price: 10000,    drunk: 1.5, tier: 'cheap' },
  { id: 10, name: '🍶 Budget Soju',         price: 15000,    drunk: 1.6, tier: 'cheap' },
  { id: 11, name: '🥃 Smirnoff Vodka',      price: 500000,   drunk: 1.0, tier: 'mid' },
  { id: 12, name: '🍹 Captain Morgan Rum',  price: 600000,   drunk: 0.9, tier: 'mid' },
  { id: 13, name: '🍸 Gordon\'s Gin',       price: 700000,   drunk: 0.9, tier: 'mid' },
  { id: 14, name: '🥃 Jack Daniel\'s',      price: 800000,   drunk: 0.8, tier: 'mid' },
  { id: 15, name: '🥃 Jameson Whiskey',     price: 900000,   drunk: 0.8, tier: 'mid' },
  { id: 16, name: '🍹 Bacardi',             price: 600000,   drunk: 0.9, tier: 'mid' },
  { id: 17, name: '🍹 Malibu',             price: 500000,   drunk: 0.7, tier: 'mid' },
  { id: 18, name: '🌵 Jose Cuervo Tequila', price: 1000000,  drunk: 1.0, tier: 'mid' },
  { id: 19, name: '🥃 Chivas Regal',       price: 1500000,  drunk: 0.7, tier: 'mid' },
  { id: 20, name: '🥃 Ballantine\'s',       price: 2000000,  drunk: 0.6, tier: 'mid' },
  { id: 21, name: '🍾 Grey Goose Vodka',    price: 5000000,  drunk: 0.5, tier: 'premium' },
  { id: 22, name: '🥃 Hennessy VS',         price: 6000000,  drunk: 0.4, tier: 'premium' },
  { id: 23, name: '🍾 Moet & Chandon',      price: 7000000,  drunk: 0.3, tier: 'premium' },
  { id: 24, name: '🍾 Dom Perignon',        price: 8000000,  drunk: 0.3, tier: 'premium' },
  { id: 25, name: '🥃 Macallan 12',         price: 9000000,  drunk: 0.3, tier: 'premium' },
  { id: 26, name: '🥃 Johnnie Walker Blue', price: 10000000, drunk: 0.2, tier: 'premium' },
  { id: 27, name: '🥃 Remy Martin XO',      price: 11000000, drunk: 0.2, tier: 'premium' },
  { id: 28, name: '🌵 Clase Azul Tequila',  price: 12000000, drunk: 0.2, tier: 'premium' },
  { id: 29, name: '🥃 Louis XIII Cognac',   price: 14000000, drunk: 0.1, tier: 'premium' },
  { id: 30, name: '🍾 Armand de Brignac',   price: 15000000, drunk: 0.1, tier: 'premium' },
];

const TIER_COLORS = { cheap: 0x8B4513, mid: 0xC0C0C0, premium: 0xFFD700 };

module.exports = {
  name: 'pub',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    if (user.drunk === undefined) user.drunk = 0;
    if (!user.addiction) user.addiction = false;
    if (!user.drinkCount) user.drinkCount = 0;

    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('🍺 PUB');

    if (!args[0]) {
      const cheap = DRINKS.filter(d => d.tier === 'cheap').map(d => `\`${d.id}\` ${d.name} — ₮${shortNum(d.price)}`).join('\n');
      const mid = DRINKS.filter(d => d.tier === 'mid').map(d => `\`${d.id}\` ${d.name} — ₮${shortNum(d.price)}`).join('\n');
      const premium = DRINKS.filter(d => d.tier === 'premium').map(d => `\`${d.id}\` ${d.name} — ₮${shortNum(d.price)}`).join('\n');
      const drunkBar = '🟡'.repeat(Math.floor(user.drunk)) + '⬛'.repeat(10 - Math.min(10, Math.floor(user.drunk)));

      embed.addFields(
        { name: `🥴 Согтолт: ${user.drunk.toFixed(1)}/10.0`, value: drunkBar },
        { name: '🟤 Доод зэрэглэл', value: cheap },
        { name: '⚪ Дунд зэрэглэл', value: mid },
        { name: '🟡 Дээд зэрэглэл', value: premium },
      ).setFooter({ text: '!pub <дугаар> | 3.0+ work ажиллахгүй | 6.0+ бүх cmd ажиллахгүй' });
      return message.reply({ embeds: [embed] });
    }

    const itemId = parseInt(args[0]);
    const drink = DRINKS.find(d => d.id === itemId);
    if (!drink) return message.reply({ embeds: [embed.setDescription('❌ Зөв дугаар оруул.')] });
    if (user.cash < drink.price) return message.reply({ embeds: [embed.setDescription(`❌ Мөнгө хүрэлцэхгүй! Cash: ₮${shortNum(user.cash)}`)] });

    let finalPrice = drink.price;
    if (user.inventory?.luxury_drink_ticket && drink.tier === 'premium') {
      finalPrice = Math.floor(drink.price * 0.5);
    }

    user.cash -= finalPrice;
    const prevDrunk = user.drunk;
    user.drunk = Math.min(10, parseFloat((user.drunk + drink.drunk).toFixed(1)));
    user.drinkCount = (user.drinkCount || 0) + 1;
    if (user.drinkCount >= 10) user.addiction = true;
    user.lastDrink = Date.now();

    saveUser(userId, user);

    let warning = '';
    if (user.drunk >= 6) warning = '\n🚫 **6.0+** — Бүх команд ажиллахгүй!';
    else if (user.drunk >= 3) warning = '\n⚠️ **3.0+** — !work ажиллахгүй!';
    if (user.addiction) warning += '\n🚨 **Архинд орлоо!** Shop-оос Anti-Addiction Pill авна уу.';

    embed.setColor(TIER_COLORS[drink.tier])
      .setTitle(drink.name)
      .setDescription(warning || null)
      .addFields(
        { name: '💰 Үнэ', value: `₮${shortNum(finalPrice)}`, inline: true },
        { name: '🥴 Согтолт', value: `${prevDrunk.toFixed(1)} → **${user.drunk.toFixed(1)}**`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    message.reply({ embeds: [embed] });
  },
};
