const { skipMusic } = require('../music');

module.exports = {
  name: 'skip',
  aliases: ['s'],
  async execute(message) {
    if (!message.member?.voice?.channel)
      return message.reply('❌ Voice channel-д орно уу!');
    const skipped = skipMusic(message.guild.id);
    if (!skipped) return message.reply('❌ Тоглож байгаа дуу байхгүй.');
    message.reply('⏭️ Дараагийн дуу руу орлоо!');
  },
};
