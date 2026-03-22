const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

module.exports = {
  name: 'takemoney',
  aliases: ['tm'],
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || !amount || amount <= 0) return;

    const user = getUser(target.id);
    user.cash = Math.max(0, user.cash - amount);
    saveUser(target.id, user);
    await message.author.send(`✅ **${target.username}**-аас **₮${shortNum(amount)}** хасав. Үлдэгдэл: ₮${shortNum(user.cash)}`);
    await message.delete().catch(() => {});
  },
};
