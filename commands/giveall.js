const { getUser, saveUser, getAllUsers } = require('../db');
const { shortNum } = require('../economy');

module.exports = {
  name: 'giveall',
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return;

    const amount = parseInt(args[0]);
    if (!amount || amount <= 0) return;

    // Server-ийн бүх гишүүдэд өгөх
    const members = await message.guild.members.fetch();
    let count = 0;

    for (const [memberId, member] of members) {
      if (member.user.bot) continue;
      const user = getUser(memberId);
      user.cash += amount;
      saveUser(memberId, user);
      count++;
    }

    await message.author.send(`✅ **${count} хэрэглэгч** бүрт **₮${shortNum(amount)}** өгөв.`);
    await message.delete().catch(() => {});
  },
};
