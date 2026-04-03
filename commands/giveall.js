const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');

module.exports = {
  name: 'giveall',
  async execute(message, args) {
    if (message.author.id !== message.guild.ownerId) return;
    const amount = parseInt(args[0]);
    if (!amount || amount <= 0) return message.reply('❌ Жишээ: `!giveall 1000`');
    await message.reply(`⏳ Бүх гишүүдэд ₮${shortNum(amount)} өгч байна...`);
    try {
      const members = await message.guild.members.fetch();
      let count = 0;
      for (const [memberId, member] of members) {
        if (member.user.bot) continue;
        const user = getUser(memberId);
        user.cash += amount;
        saveUser(memberId, user);
        count++;
      }
      message.channel.send(`✅ **${count} хэрэглэгч** бүрт **₮${shortNum(amount)}** өгөв!`);
    } catch (err) {
      console.error(err);
    }
  },
};
