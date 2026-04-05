const { toggleLoop } = require('../music');

module.exports = {
  name: 'loop',
  async execute(message) {
    if (!message.member?.voice?.channel)
      return message.reply('❌ Voice channel-д орно уу!');
    const looping = toggleLoop(message.guild.id);
    if (looping === null) return message.reply('❌ Тоглуулах дуу байхгүй.');
    message.reply(looping ? '🔁 Loop асаагдлаа!' : '➡️ Loop унтраагдлаа.');
  },
};
