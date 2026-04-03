const { setOwner } = require('../db');

module.exports = {
  name: 'setowner',
  async execute(message) {
    if (message.author.id !== message.guild.ownerId) return;
    const target = message.mentions.users.first() || message.author;
    setOwner(target.id);
    await message.author.send(`✅ **${target.username}** economy owner боллоо.`);
    await message.delete().catch(() => {});
  },
};
