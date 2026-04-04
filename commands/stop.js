const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  async execute(message) {
    if (!message.member.voice.channel) return message.reply('❌ Voice channel-д орно уу!');
    const { queues } = require('./play');
    const queue = queues?.get(message.guild.id);
    if (!queue) return message.reply('❌ Одоо дуу тоглуулахгүй байна.');
    queue.songs = [];
    queue.player?.stop();
    queue.connection?.destroy();
    queues.delete(message.guild.id);
    message.reply({ embeds: [new EmbedBuilder().setColor(0xE8B84B).setTitle('⏹️ Зогсоолоо')] });
  },
};
