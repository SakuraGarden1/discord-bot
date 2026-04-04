const { EmbedBuilder } = require('discord.js');
const music = require('../music');

module.exports = {
  name: 'np',
  aliases: ['nowplaying'],
  async execute(message) {
    if (!message.guild) return message.reply('❌ Энэ команд зөвхөн сервер дээр ажиллана.');
    const cur = music.getNowPlaying(message.guild.id);
    if (!cur) return message.reply('❌ Одоо юу ч тоглож байхгүй.');
    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('🎧 Одоо тоглож байна')
      .setDescription(`**${cur.title}**`)
      .addFields({ name: 'Оруулсан', value: cur.requester, inline: true });
    return message.reply({ embeds: [embed] });
  },
};
