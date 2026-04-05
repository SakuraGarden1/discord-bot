const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xFFC0CB)
      .setTitle('🌸 BOT КОМАНДУУД')
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: '💰 Мөнгө олох', value: '`!work` (5 мин)\n`!daily` (24 цаг)\n`!crime` (45 мин)\n`!job` — Ажил сонгох\n`!jobs` — Бүх ажил харах' },
        { name: '🎮 Тоглоомууд', value: '`!sl <дүн>` — Slot\n`!cf <дүн> h/t` — Coinflip\n`!bj <дүн>` — Blackjack\n`!dice <дүн> <1-6>`\n`!rps <дүн> r/p/s`\n`!guess <дүн>`\n`!crash <дүн>`\n`!hl <дүн> h/l`' },
        { name: '🦹 Хулгай', value: '`!rob @user` (1 цаг)\n`!br @user` (6 цаг)' },
        { name: '🏦 Банк', value: '`!dep <дүн/all>`\n`!with <дүн/all>`\n`!pay @user <дүн>`' },
        { name: '💍 Гэрлэлт', value: '`!marry @user`\n`!marry accept/decline/divorce`' },
        { name: '📊 Мэдээлэл', value: '`!bal` `!pro` `!lb` `!inv` `!jobs`' },
        { name: '🏪 Дэлгүүр', value: '`!shop` `!buy <1-14>` `!use luckycharm`' },
      )
      .setFooter({ text: '🌸 Level ахих тусам цалин нэмэгдэнэ!' });
    message.reply({ embeds: [embed] });
  },
};
