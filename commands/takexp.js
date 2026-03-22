const { getUser, saveUser } = require('../db');

module.exports = {
  name: 'takexp',
  aliases: ['txp'],
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || !amount || amount <= 0) return;

    const user = getUser(target.id);
    user.xp = Math.max(0, user.xp - amount);
    saveUser(target.id, user);
    await message.author.send(`✅ **${target.username}**-аас **${amount} XP** хасав.`);
    await message.delete().catch(() => {});
  },
};
