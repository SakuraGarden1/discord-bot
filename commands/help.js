const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xE8B84B)
      .setTitle('📖 BOT КОМАНДУУД')
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: '🎵 Music', value: '`!play <дуу/link>` / `!p` — Дуу тоглуулах\n`!stop` — Зогсоох\n`!skip` — Дараагийн дуу\n`!queue` / `!q` — Жагсаалт\n`!loop` — Давтах\n`!np` — Одоогийн дуу' },
        { name: '💰 Мөнгө олох', value: '`!work` (10 мин)\n`!daily` (24 цаг)\n`!crime` (45 мин)\n`!job` — Ажил сонгох' },
        { name: '🎮 Тоглоомууд', value: '`!sl` `!cf h/t` `!bj` `!dice` `!rps` `!guess` `!crash` `!hl`' },
        { name: '🦹 Хулгай', value: '`!rob @user` (1 цаг)\n`!br @user` (24 цаг)' },
        { name: '🏦 Банк', value: '`!dep` `!with` `!pay @user`' },
        { name: '☕ Cafe', value: '`!cafe` — Цэс харах\n`!cafe <дугаар>` — Хоол авах' },
        { name: '💍 Гэрлэлт', value: '`!marry @user` `accept` `decline` `divorce`' },
        { name: '📊 Мэдээлэл', value: '`!bal` `!pro` `!lb` `!inv` `!jobs`' },
        { name: '🏪 Дэлгүүр', value: '`!shop` `!buy <1-19>` `!use luckycharm`' },
      )
      .setFooter({ text: '📈 Level ахих тусам цалин нэмэгдэнэ!' });
    message.reply({ embeds: [embed] });
  },
};
