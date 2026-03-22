const { getUser, saveUser } = require('../db');
const { checkLevelUp, getJob, shortNum } = require('../economy');

module.exports = {
  name: 'givexp',
  aliases: ['gxp'],
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return;

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || !amount || amount <= 0) return;

    const user = getUser(target.id);
    user.xp += amount;
    const leveled = checkLevelUp(user);
    saveUser(target.id, user);

    const job = getJob(user.level);
    let reply = `✅ **${target.username}**-д **${amount} XP** өгөв.\n⭐ Level: ${user.level} | XP: ${user.xp}/${user.level * 100}`;
    if (leveled) reply += `\n🎉 **LEVEL UP! → ${user.level}** | 👔 ${job.name}`;

    await message.author.send(reply);
    await message.delete().catch(() => {});
  },
};
