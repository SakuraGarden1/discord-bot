const { setOwner, getOwner } = require('../db');

module.exports = {
  name: 'setowner',
  async execute(message) {
    // Only server owner can set the economy owner
    if (message.author.id !== message.guild.ownerId) {
      return message.reply('❌ Зөвхөн server owner ашиглах боломжтой.');
    }
    const target = message.mentions.users.first() || message.author;
    setOwner(target.id);
    message.reply(`✅ **${target.username}** одоо economy owner боллоо. Татвар тэдний дансанд орно.`);
  },
};
