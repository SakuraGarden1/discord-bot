const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('📖 BOT КОМАНДУУД')
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: '💰 Мөнгө олох', value: ['💼 `!work` (10 мин)', '🎁 `!daily` (24 цаг)', '🦹 `!crime` (45 мин)', '👔 `!job` — Ажил сонгох'].join('\n') },
        { name: '🎮 Тоглоомууд', value: ['🎰 `!slot` / `!sl`', '🪙 `!cf <дүн> h/t`', '🃏 `!bj <дүн>`', '🦹 `!rob @user`', '🏦 `!bankrob @user` / `!br` (3 цаг)', '🎲 `!dice <дүн> <1-6>`', '✂️ `!rps <дүн> r/p/s`', '🔢 `!guess <дүн>`', '🚀 `!crash <дүн>`', '🃏 `!highlow` / `!hl <дүн> h/l`'].join('\n') },
        { name: '🏦 Банк', value: ['🏦 `!dep <дүн|all>`', '💵 `!with <дүн|all>`', '💸 `!pay @user <дүн>`'].join('\n') },
        { name: '☕ Cafe', value: ['🍽️ `!cafe` — Цэс харах', '🍜 `!cafe <дугаар>` — Хоол авах', '⚠️ Өлссөн бол work ажиллахгүй!'].join('\n') },
        { name: '💍 Гэрлэлт', value: ['💍 `!marry @user` — Санал тавих', '✅ `!marry accept` — Зөвшөөрөх', '❌ `!marry decline` — Татгалзах', '💔 `!marry divorce` — Салалт'].join('\n') },
        { name: '📊 Мэдээлэл', value: ['👛 `!bal`', '👤 `!pro`', '🏆 `!lb`', '🎒 `!inv`', '🏪 `!shop` / `!buy <дугаар>`', '🎰 `!use luckycharm`'].join('\n') },
      )
      .setFooter({ text: '💡 Татвар зөвхөн !work дээр авна | 📈 Level ахих тусам цалин нэмэгдэнэ!' });
    message.reply({ embeds: [embed] });
  },
};
