const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'loop',
  async execute(message) {
    const playModule = require('./play');
    const queues = playModule.queues || new Map();
    const queue = queues.get(message.guild.id);
    if (!queue) return message.reply('❌ Дуу тоглуулахгүй байна.');
    queue.loop = !queue.loop;
    message.reply({ embeds: [new EmbedBuilder().setColor(0xE8B84B).setTitle(`🔁 Loop ${queue.loop ? 'идэвхжлээ' : 'унтраалаа'}`)] });
  },
};
