const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  aliases: ['s'],
  async execute(message) {
    if (!message.member.voice.channel) return message.reply('❌ Voice channel-д орно уу!');
    // play.js-с queue авах
    const playModule = require('./play');
    const queues = playModule.queues || new Map();
    const queue = queues.get(message.guild.id);
    if (!queue || queue.songs.length === 0) return message.reply('❌ Дуу байхгүй байна.');
    const skipped = queue.songs[0].title;
    queue.player?.stop();
    message.reply({ embeds: [new EmbedBuilder().setColor(0xE8B84B).setTitle('⏭️ Skip').setDescription(`**${skipped}** -г алгасав`)] });
  },
};
