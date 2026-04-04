const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  async execute(message) {
    const playModule = require('./play');
    const queues = playModule.queues || new Map();
    const queue = queues.get(message.guild.id);
    const embed = new EmbedBuilder().setColor(0xE8B84B).setTitle('🎵 Queue');
    if (!queue || queue.songs.length === 0) return message.reply({ embeds: [embed.setDescription('Queue хоосон байна.')] });
    const list = queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i}.`} **${s.title}** (${s.duration})`).slice(0, 10).join('\n');
    embed.setDescription(list);
    if (queue.loop) embed.setFooter({ text: '🔁 Loop идэвхтэй' });
    message.reply({ embeds: [embed] });
  },
};
