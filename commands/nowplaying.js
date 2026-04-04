const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  async execute(message) {
    const playModule = require('./play');
    const queues = playModule.queues || new Map();
    const queue = queues.get(message.guild.id);
    const embed = new EmbedBuilder().setColor(0xE8B84B);
    if (!queue || queue.songs.length === 0) return message.reply({ embeds: [embed.setTitle('❌ Одоо дуу тоглуулахгүй байна.')] });
    const song = queue.songs[0];
    embed.setTitle('🎵 Одоо тоглуулж байна')
      .setDescription(`**${song.title}**`)
      .addFields({ name: '⏱️', value: song.duration, inline: true }, { name: '👤', value: song.requestedBy, inline: true })
      .setThumbnail(song.thumbnail);
    message.reply({ embeds: [embed] });
  },
};
