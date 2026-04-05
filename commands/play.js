const { enqueue } = require('../music');

module.exports = {
  name: 'play',
  aliases: ['p'],
  async execute(message, args) {
    if (!message.member?.voice?.channel)
      return message.reply('❌ Эхлээд voice channel-д орно уу!');
    if (!args.length)
      return message.reply('❌ Хайх дуугаа бич! Жишээ: `!play Adele Hello`');

    const query = args.join(' ');
    const msg = await message.reply('🔍 Хайж байна...');
    const result = await enqueue(message, query);

    if (!result.ok) return msg.edit(`❌ ${result.error}`);
    msg.edit(`✅ **${result.titles[0]}** дараалалд нэмэгдлээ!`);
  },
};
