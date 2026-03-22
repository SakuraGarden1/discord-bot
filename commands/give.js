const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

module.exports = {
  name: 'give',
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return message.reply('❌ Зөвхөн Admin ашиглах боломжтой.');

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || !amount || amount <= 0) return message.reply({ content: '❌ Жишээ: `!give @user 10000`', ephemeral: true });

    const user = getUser(target.id);
    user.cash += amount;
    saveUser(target.id, user);

    // Зөвхөн admin-д харагдана
    await message.author.send(`✅ **${target.username}**-д **₮${shortNum(amount)}** өгөв.`);
    await message.delete().catch(() => {});
  },
};
