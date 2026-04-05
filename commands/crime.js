const { getUser, saveUser } = require('../db');
const { rand, shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 45 * 60 * 1000;

const CRIMES = [
  { name: '🏪 Дэлгүүр дээрэмдэх',  success: 0.55, reward: [2000, 5000],   fine: [500, 1500] },
  { name: '🚗 Машин хулгайлах',      success: 0.45, reward: [4000, 8000],   fine: [1000, 3000] },
  { name: '🏦 Банк дээрэмдэх',       success: 0.30, reward: [8000, 15000],  fine: [2000, 6000] },
  { name: '💎 Эрдэнэсийн дэлгүүр',  success: 0.25, reward: [10000, 20000], fine: [3000, 8000] },
  { name: '🖥️ Хакердах',            success: 0.40, reward: [5000, 12000],  fine: [1500, 4000] },
];

module.exports = {
  name: 'crime',
  async execute(message) {
    const userId = message.author.id;
    const user = getUser(userId);
    const now = Date.now();
    const embed = new EmbedBuilder().setColor(0xFFC0CB);

    if (!user.lastCrime) user.lastCrime = 0;
    if (now - user.lastCrime < COOLDOWN) {
      const left = Math.ceil((COOLDOWN - (now - user.lastCrime)) / 60000);
      return message.reply({ embeds: [embed.setTitle('🦹 Crime').setDescription(`⏳ **${left} минут** дараа гэмт хэрэг үйлдэж болно.`)] });
    }

    const crime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
    const success = Math.random() < crime.success;
    user.lastCrime = now;

    embed.setTitle(crime.name);

    if (success) {
      const earned = rand(...crime.reward);
      
      user.cash += earned;
      saveUser(userId, user);
      embed.addFields(
        { name: '✅ Амжилттай!', value: 'Мултарч чадлаа', inline: false },
        { name: '💰 Олсон', value: `₮${shortNum(earned)}`, inline: true },
        
        
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    } else {
      const fine = rand(...crime.fine);
      user.cash = Math.max(0, user.cash - fine);
      saveUser(userId, user);
      embed.addFields(
        { name: '👮 БАРИГДЛАА!', value: 'Цагдаа баривчиллаа', inline: false },
        { name: '💸 Торгууль', value: `₮${shortNum(fine)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
      );
    }

    message.reply({ embeds: [embed] });
  },
};
