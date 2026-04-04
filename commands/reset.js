const { saveUser } = require('../db');

module.exports = {
  name: 'reset',
  async execute(message, args) {
    if (message.author.id !== message.guild.ownerId) return;
    const target = message.mentions.users.first();
    if (!target) return;
    saveUser(target.id, { cash: 1000, bank: 0, xp: 0, level: 1, lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0, lastBankRob: 0, dailyStreak: 0, inventory: {}, hunger: 100, lastHungerUpdate: Date.now(), married: null, selectedJob: null, drunk: 0, stress: 0, addiction: false, drinkCount: 0, lastDrink: 0 });
    await message.author.send(`🔄 **${target.username}**-ын акаунт reset хийгдлээ.`);
    await message.delete().catch(() => {});
  },
};
