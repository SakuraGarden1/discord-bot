const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

module.exports = {
  name: 'give',
  async execute(message, args) {
    if (message.author.id !== message.guild.ownerId) return;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || !amount || amount <= 0) return;
    const user = getUser(target.id);
    user.cash += amount;
    saveUser(target.id, user);
    await message.author.send(`✅ **${target.username}**-д **₮${shortNum(amount)}** өгөв.`);
    await message.delete().catch(() => {});
  },
};
