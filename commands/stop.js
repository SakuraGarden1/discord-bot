const { stopMusic } = require('../music');

module.exports = {
  name: 'stop',
  async execute(message) {
    if (!message.member?.voice?.channel)
      return message.reply('❌ Voice channel-д орно уу!');
    stopMusic(message.guild.id);
    message.reply('⏹️ Дуу зогсоогдлоо, дараалал цэвэрлэгдлээ.');
  },
};
