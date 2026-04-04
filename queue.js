const { getQueueList, isLooping } = require('../music');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  async execute(message) {
    const songs = getQueueList(message.guild.id);
    if (!songs.length) return message.reply('📭 Дараалал хоосон байна.');

    const loop = isLooping(message.guild.id);
    const lines = songs.slice(0, 10).map((s, i) =>
      i === 0
        ? `▶️ **${s.title}** — *${s.requester}*`
        : `\`${i}.\` ${s.title} — *${s.requester}*`
    );
    if (songs.length > 10) lines.push(`... болон ${songs.length - 10} дуу байна.`);

    message.reply(`🎵 **Дараалал** ${loop ? '🔁 (loop)' : ''}\n${lines.join('\n')}`);
  },
};
