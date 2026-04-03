const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const CIGARETTES = [
  { id: 1,  name: '🚬 Basic Cigarette',      price: 5000,    stress: 20, type: 'cig' },
  { id: 2,  name: '🚬 Cheap Tobacco',        price: 8000,    stress: 22, type: 'cig' },
  { id: 3,  name: '🚬 Rolling Cigarette',    price: 10000,   stress: 25, type: 'cig' },
  { id: 4,  name: '🚬 Classic Marlboro',     price: 20000,   stress: 28, type: 'cig' },
  { id: 5,  name: '🚬 Camel Blue',           price: 25000,   stress: 30, type: 'cig' },
  { id: 6,  name: '🚬 Lucky Strike',         price: 30000,   stress: 32, type: 'cig' },
  { id: 7,  name: '🚬 Dunhill',              price: 40000,   stress: 35, type: 'cig' },
  { id: 8,  name: '🚬 Parliament',           price: 50000,   stress: 38, type: 'cig' },
  { id: 9,  name: '🚬 Sobranie',             price: 80000,   stress: 40, type: 'cig' },
  { id: 10, name: '🚬 Davidoff',             price: 100000,  stress: 42, type: 'cig' },
  { id: 11, name: '🚬 Kent',                 price: 120000,  stress: 44, type: 'cig' },
  { id: 12, name: '🚬 Winston',              price: 150000,  stress: 46, type: 'cig' },
  { id: 13, name: '🚬 Esse',                 price: 200000,  stress: 48, type: 'cig' },
  { id: 14, name: '🚬 Vogue',                price: 300000,  stress: 50, type: 'cig' },
  { id: 15, name: '🚬 Premium Gold Cigarette', price: 500000, stress: 55, type: 'cig' },
];

const VAPES = [
  { id: 16, name: '💨 Basic Vape',           price: 10000,   stress: 18, type: 'vape' },
  { id: 17, name: '💨 Mini Vape',            price: 20000,   stress: 20, type: 'vape' },
  { id: 18, name: '💨 Fruit Vape',           price: 30000,   stress: 22, type: 'vape' },
  { id: 19, name: '💨 Ice Vape',             price: 50000,   stress: 25, type: 'vape' },
  { id: 20, name: '💨 Cloud Vape',           price: 80000,   stress: 28, type: 'vape' },
  { id: 21, name: '💨 Nano Vape',            price: 100000,  stress: 30, type: 'vape' },
  { id: 22, name: '💨 Stick Vape',           price: 150000,  stress: 32, type: 'vape' },
  { id: 23, name: '💨 Pod Vape',             price: 200000,  stress: 35, type: 'vape' },
  { id: 24, name: '💨 Smok Vape',            price: 300000,  stress: 38, type: 'vape' },
  { id: 25, name: '💨 Vaporesso',            price: 400000,  stress: 40, type: 'vape' },
  { id: 26, name: '💨 GeekVape',             price: 500000,  stress: 42, type: 'vape' },
  { id: 27, name: '💨 Voopoo',               price: 700000,  stress: 45, type: 'vape' },
  { id: 28, name: '💨 Lost Vape',            price: 1000000, stress: 48, type: 'vape' },
  { id: 29, name: '💨 Elf Bar',              price: 1500000, stress: 52, type: 'vape' },
  { id: 30, name: '💨 Premium Pro Vape',     price: 3000000, stress: 60, type: 'vape' },
];

const ALL_ITEMS = [...CIGARETTES, ...VAPES];

module.exports = {
  name: 'cigarshop',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    if (user.stress === undefined) user.stress = 0;

    const embed = new EmbedBuilder().setColor(0x708090).setTitle('🚬 CIGAR SHOP');

    if (!args[0]) {
      const stressBar = '🔴'.repeat(Math.floor(user.stress / 10)) + '⬛'.repeat(10 - Math.min(10, Math.floor(user.stress / 10)));
      const cigs = CIGARETTES.map(i => `\`${i.id}\` ${i.name} — ₮${shortNum(i.price)} (-${i.stress} stress)`).join('\n');
      const vapes = VAPES.map(i => `\`${i.id}\` ${i.name} — ₮${shortNum(i.price)} (-${i.stress} stress)`).join('\n');

      embed.addFields(
        { name: `😤 Stress: ${user.stress}/100`, value: stressBar },
        { name: '🚬 Янжуур тамхи', value: cigs },
        { name: '💨 Vape', value: vapes },
      ).setFooter({ text: '!cigarshop <дугаар> | Стресс бууруулахын тулд тамхи тат!' });
      return message.reply({ embeds: [embed] });
    }

    const itemId = parseInt(args[0]);
    const item = ALL_ITEMS.find(i => i.id === itemId);
    if (!item) return message.reply({ embeds: [embed.setDescription('❌ Зөв дугаар оруул.')] });
    if (user.cash < item.price) return message.reply({ embeds: [embed.setDescription(`❌ Мөнгө хүрэлцэхгүй!`)] });

    user.cash -= item.price;
    const prevStress = user.stress;
    user.stress = Math.max(0, user.stress - item.stress);
    saveUser(userId, user);

    embed.setTitle(item.name)
      .addFields(
        { name: '💰 Үнэ', value: `₮${shortNum(item.price)}`, inline: true },
        { name: '😤 Stress', value: `${prevStress} → **${user.stress}**`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    message.reply({ embeds: [embed] });
  },
};
