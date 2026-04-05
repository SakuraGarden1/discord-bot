const { EmbedBuilder } = require('discord.js');
const { shortNum } = require('../economy');

module.exports = {
  name: 'shop',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xFFC0CB)
      .setTitle('🏪 ДЭЛГҮҮР')
      .addFields(
        { name: '🛡️ Хамгаалалт', value: '`1` 🛡️ Rob Shield — ₮5k\n↳ Cash хулгайгаас хамгаална\n`2` 🏦 Bank Shield — ₮8k\n↳ Bank rob-оос хамгаална\n`3` 👮 Police Protection — ₮5M\n↳ Rob хийгчийг 30% магадлалтай торгоно' },
        { name: '⚙️ Boost', value: '`4` ⚡ XP Boost (1hr) — ₮8k\n↳ 1 цагийн турш XP 2x (автоматаар дуусна)\n`5` 🎰 Lucky Charm — ₮12k\n↳ Slot-д 10 удаа lucky\n`6` 💼 Work Boost — ₮15k\n↳ 5 удаа ажлын цалин 1.5x\n`7` 🏧 Bank Expand — ₮50k\n↳ Bank хязгаар 2x' },
        { name: '💎 Special', value: '`8` 💰 Money Printer — ₮10M\n↳ 1 цаг тутам мөнгө generate\n`9` 🎫 Double Bet Ticket — ₮10M\n↳ Дараагийн work 2x цалин\n`10` 💎 VIP Pass — ₮30M\n↳ Cooldown -30%, reward +30%\n`11` 🏅 SUPREME Badge — ₮50M\n↳ Profile-д SUPREME badge' },
        { name: '💍 Бөгж (гэрлэлт)', value: '`12` 💍 Мөнгөн бөгж — ₮5M\n`13` 💎 Алтан бөгж — ₮10M\n`14` 👑 Алмазан бөгж — ₮50M' },
      )
      .setFooter({ text: '!buy <дугаар 1-14>' });

    message.reply({ embeds: [embed] });
  },
};
