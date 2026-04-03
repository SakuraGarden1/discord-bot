const { EmbedBuilder } = require('discord.js');
const { shortNum } = require('../economy');

module.exports = {
  name: 'shop',
  async execute(message) {
    const embed1 = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('🏪 ДЭЛГҮҮР — Хамгаалалт & Boost')
      .addFields(
        { name: '🛡️ Хамгаалалт', value: '`1` 🛡️ Rob Shield — ₮5k\n↳ Cash хулгайгаас хамгаална\n`2` 🏦 Bank Shield — ₮8k\n↳ Bank rob-оос хамгаална\n`3` 👮 Police Protection — ₮5M\n↳ Rob хийгчийг 30% магадлалтай торгоно' },
        { name: '⚙️ Boost', value: '`4` ⚡ XP Boost (1hr) — ₮8k\n↳ 1 цагийн турш XP 2x\n`5` 🎰 Lucky Charm — ₮12k\n↳ Slot-д 10 удаа lucky\n`6` 💼 Work Boost — ₮15k\n↳ 5 удаа ажлын цалин 1.5x\n`7` 🏧 Bank Expand — ₮50k\n↳ Bank хязгаар 2x' },
        { name: '💎 Special', value: '`8` 💰 Money Printer — ₮10M\n↳ 1 цаг тутам мөнгө generate\n`9` 🎫 Double Bet Ticket — ₮10M\n↳ Дараагийн work 2x цалин\n`10` 💎 VIP Pass — ₮30M\n↳ Cooldown -30%, reward +30%\n`11` 🏅 SUPREME Badge — ₮50M\n↳ Profile-д SUPREME badge\n`12` 🎟️ Luxury Drink Ticket — ₮1M\n↳ Pub premium архи 50% хямд' },
      );

    const embed2 = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('🏪 ДЭЛГҮҮР — Эм & Хоол & Бөгж')
      .addFields(
        { name: '💊 Эм', value: '`13` 🍺 Hangover Cure — ₮100k\n↳ Согтолтыг -3.0 бууруулна\n`14` 💊 Anti-Addiction Pill — ₮100k\n↳ Архины addiction арилгана' },
        { name: '🍔 Хоол', value: '`15` 🍔 Burger — ₮10k (+20% hunger)\n`16` 🍕 Pizza — ₮30k (+40% hunger)\n`17` 🥩 Steak — ₮100k (+80% hunger)\n`18` ✨ Golden Meal — ₮1M (full hunger + buff)' },
        { name: '💍 Бөгж (гэрлэлт)', value: '`19` 💍 Мөнгөн бөгж — ₮5M\n`20` 💎 Алтан бөгж — ₮10M\n`21` 👑 Алмазан бөгж — ₮50M' },
      )
      .setFooter({ text: '!buy <дугаар> | 🍺 !pub | 🚬 !cigarshop' });

    message.reply({ embeds: [embed1] });
    message.channel.send({ embeds: [embed2] });
  },
};
