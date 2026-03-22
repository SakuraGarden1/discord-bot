const { saveUser } = require('../db');

module.exports = {
  name: 'reset',
  async execute(message, args) {
    const isAdmin = message.member.permissions.has('Administrator') || message.author.id === message.guild.ownerId;
    if (!isAdmin) return;

    const target = message.mentions.users.first();
    if (!target) return;

    saveUser(target.id, {
      cash: 1000, bank: 0, xp: 0, level: 1,
      lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0,
      dailyStreak: 0, inventory: {},
    });

    await message.author.send(`🔄 **${target.username}**-ын акаунт reset хийгдлээ.`);
    await message.delete().catch(() => {});
  },
};
