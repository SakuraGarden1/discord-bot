const { EmbedBuilder } = require('discord.js');
const music = require('../music');

module.exports = {
  name: 'leave',
  aliases: ['disconnect', 'dc'],
  async execute(message) {
    if (!message.guild) return message.reply('❌ Энэ команд зөвхөн сервер дээр ажиллана.');
    music.leaveVoice(message.guild.id);
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('👋 Leave').setDescription('Дууны сувагнаас гарлаа.');
    return message.reply({ embeds: [embed] });
  },
};
