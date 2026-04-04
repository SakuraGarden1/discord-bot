const { getNowPlaying, isLooping } = require('../music');

module.exports = {
  name: 'np',
  aliases: ['nowplaying'],
  async execute(message) {
    const song = getNowPlaying(message.guild.id);
    if (!song) return message.reply('❌ Одоо тоглож байгаа дуу байхгүй.');
    const loop = isLooping(message.guild.id);
    message.reply(`🎶 **Одоо тоглож байна:** ${song.title}\n👤 Хүсэлт: *${song.requester}* ${loop ? '🔁' : ''}`);
  },
};
