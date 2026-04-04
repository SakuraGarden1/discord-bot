const { EmbedBuilder } = require('discord.js');
const { shortNum } = require('../economy');

module.exports = {
  name: 'shop',
  async execute(message) {
    const embed1 = new EmbedBuilder()
      .setColor(0xE8B84B)
      .setTitle('🏪 ДЭЛГҮҮР — Хамгаалалт & Boost')
      .addFields(
        { name: '🛡️ Хамгаалалт', value: '`1` 🛡️ Rob Shield — ₮5k\n↳ Cash хулгайгаас хамгаална\n`2` 🏦 Bank Shield — ₮8k\n↳ Bank rob-оос хамгаална\n`3` 👮 Police Protection — ₮5M\n↳ Rob хийгчийг 30% магадлалтай торгоно' },
        { name: '⚙️ Boost', value: '`4` ⚡ XP Boost (1hr) — ₮8k\n`5` 🎰 Lucky Charm — ₮12k\n`6` 💼 Work Boost — ₮15k\n`7` 🏧 Bank Expand — ₮50k' },
        { name: '💎 Special', value: '`8` 💰 Money Printer — ₮10M\n`9` 🎫 Double Bet Ticket — ₮10M\n`10` 💎 VIP Pass — ₮30M\n`11` 🏅 SUPREME Badge — ₮50M\n`12` 🎟️ Luxury Drink Ticket — ₮1M' },
      );

    const embed2 = new EmbedBuilder()
      .setColor(0xE8B84B)
      .setTitle('🏪 ДЭЛГҮҮР — Хоол & Бөгж')
      .addFields(
        { name: '🍔 Хоол', value: '`13` 🍔 Burger — ₮10k (+20% hunger)\n`14` 🍕 Pizza — ₮30k (+40% hunger)\n`15` 🥩 Steak — ₮100k (+80% hunger)\n`16` ✨ Golden Meal — ₮1M (full hunger + buff)' },
        { name: '💍 Бөгж (гэрлэлт)', value: '`17` 💍 Мөнгөн бөгж — ₮5M\n`18` 💎 Алтан бөгж — ₮10M\n`19` 👑 Алмазан бөгж — ₮50M' },
      )
      .setFooter({ text: '!buy <дугаар 1-19>' });

    message.reply({ embeds: [embed1] });
    message.channel.send({ embeds: [embed2] });
  },
};
