const { getUser, saveUser, updateHunger } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const MENU = [
  { id: 1, name: '🍵 Цай',          price: 100,  hunger: 15, desc: 'Халуун цай' },
  { id: 2, name: '🍞 Талх',         price: 200,  hunger: 25, desc: 'Дулаан талх' },
  { id: 3, name: '🍜 Гоймон',       price: 500,  hunger: 40, desc: 'Халуун гоймон' },
  { id: 4, name: '🍖 Мах',          price: 1000, hunger: 60, desc: 'Шарсан мах' },
  { id: 5, name: '🥩 Бифштекс',     price: 2000, hunger: 80, desc: 'Тансаг бифштекс' },
  { id: 6, name: '🍱 Тансаг хоол',  price: 5000, hunger: 100, desc: 'Бүрэн цадна' },
];

module.exports = {
  name: 'cafe',
  async execute(message, args) {
    let user = getUser(message.author.id);
    user = updateHunger(user);
    const embed = new EmbedBuilder().setColor(0xE8B84B);

    if (!args[0]) {
      // Цэс харуулах
      const hungerBar = '🟩'.repeat(Math.floor(user.hunger / 10)) + '⬛'.repeat(10 - Math.floor(user.hunger / 10));
      embed.setTitle('☕ CAFE — Цэс')
        .addFields(
          { name: `🍽️ Өлсгөлөн ${Math.floor(user.hunger)}%`, value: hungerBar },
          ...MENU.map(item => ({
            name: `\`${item.id}\` ${item.name} — ₮${shortNum(item.price)}`,
            value: `${item.desc} | +${item.hunger}% цатгалан`,
          }))
        )
        .setFooter({ text: 'Хоол авахдаа: !cafe <дугаар> | Цадаагүй бол work хийж чадахгүй!' });
      return message.reply({ embeds: [embed] });
    }

    const itemId = parseInt(args[0]);
    const item = MENU.find(m => m.id === itemId);
    if (!item) return message.reply({ embeds: [embed.setTitle('☕ Cafe').setDescription('❌ Зөв дугаар оруул. `!cafe` гэж цэс харна уу.')] });
    if (user.cash < item.price) return message.reply({ embeds: [embed.setTitle('☕ Cafe').setDescription(`❌ Хангалттай мөнгө байхгүй! Cash: ₮${shortNum(user.cash)}`)] });

    user.cash -= item.price;
    user.hunger = Math.min(100, user.hunger + item.hunger);
    saveUser(message.author.id, user);

    const hungerBar = '🟩'.repeat(Math.floor(user.hunger / 10)) + '⬛'.repeat(10 - Math.floor(user.hunger / 10));
    embed.setTitle(`☕ Cafe — ${item.name}`)
      .addFields(
        { name: '🍽️ Идсэн хоол', value: item.name, inline: true },
        { name: '💰 Үнэ', value: `₮${shortNum(item.price)}`, inline: true },
        { name: `🍽️ Өлсгөлөн ${Math.floor(user.hunger)}%`, value: hungerBar },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    message.reply({ embeds: [embed] });
  },
};
