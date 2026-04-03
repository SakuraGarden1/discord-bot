const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('📖 BOT КОМАНДУУД')
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: '💰 Мөнгө олох', value: '`!work` (10 мин)\n`!daily` (24 цаг)\n`!crime` (45 мин)\n`!job` — Ажил сонгох\n`!jobs` — Бүх ажил харах' },
        { name: '🎮 Тоглоомууд', value: '`!sl <дүн>` — Slot\n`!cf <дүн> h/t` — Coinflip\n`!bj <дүн>` — Blackjack\n`!dice <дүн> <1-6>` — Шоо\n`!rps <дүн> r/p/s` — ЧЦХ\n`!guess <дүн>` — Тоо таах\n`!crash <дүн>` — Crash\n`!hl <дүн> h/l` — High Low' },
        { name: '🦹 Хулгай', value: '`!rob @user` (1 цаг)\n`!br @user` — Bank rob (24 цаг)' },
        { name: '🏦 Банк', value: '`!dep <дүн/all>`\n`!with <дүн/all>`\n`!pay @user <дүн>`' },
        { name: '🍺 Pub & 🚬 Cigar', value: '`!pub` — Архины дэлгүүр\n`!pub <дугаар>` — Архи авах\n`!cigarshop` — Тамхины дэлгүүр\n`!cigarshop <дугаар>` — Тамхи авах' },
        { name: '☕ Cafe', value: '`!cafe` — Цэс харах\n`!cafe <дугаар>` — Хоол авах\n⚠️ Өлссөн бол work ажиллахгүй!' },
        { name: '💍 Гэрлэлт', value: '`!marry @user` — Санал тавих\n`!marry accept/decline/divorce`' },
        { name: '📊 Мэдээлэл', value: '`!bal` `!pro` `!lb` `!inv`' },
        { name: '🏪 Дэлгүүр', value: '`!shop` — Дэлгүүр харах\n`!buy <дугаар>` — Item авах\n`!use luckycharm`' },
      )
      .setFooter({ text: '💡 Татвар байхгүй | 📈 Level ахих тусам цалин нэмэгдэнэ!' });
    message.reply({ embeds: [embed] });
  },
};
