const { leaveVoice } = require('../music');

module.exports = {
  name: 'leave',
  aliases: ['dc', 'disconnect'],
  async execute(message) {
    if (!message.member?.voice?.channel)
      return message.reply('❌ Voice channel-д орно уу!');
    leaveVoice(message.guild.id);
    message.reply('👋 Voice channel-аас гарлаа.');
  },
};
