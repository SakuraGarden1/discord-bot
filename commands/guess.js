const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const activeGames = new Map();

module.exports = {
  name: 'guess',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('🔢 Тоо таах');

    if (activeGames.has(userId)) {
      const game = activeGames.get(userId);
      const guess = parseInt(args[0]);
      if (isNaN(guess)) return message.reply({ embeds: [embed.setDescription('❌ Тоо оруул!')] });

      game.attempts++;
      if (guess === game.number) {
        const win = Math.floor(game.bet * (1 + (10 - game.attempts) * 0.2));
        user.cash += win;
        activeGames.delete(userId);
        saveUser(userId, user);
        embed.addFields(
          { name: '🎉 Зөв!', value: `Тоо нь **${game.number}** байлаа!` },
          { name: `${game.attempts} оролдлогоор`, value: `+₮${shortNum(win)}` },
          { name: '👛 Cash', value: `₮${shortNum(user.cash)}` },
        );
      } else {
        const hint = guess < game.number ? '📈 Илүү их' : '📉 Илүү бага';
        if (game.attempts >= 5) {
          activeGames.delete(userId);
          embed.addFields(
            { name: '😔 Оролдлого дууслаа', value: `Тоо нь **${game.number}** байлаа` },
            { name: '💸 Алдсан', value: `₮${shortNum(game.bet)}` },
          );
        } else {
          embed.addFields(
            { name: hint, value: `${5 - game.attempts} оролдлого үлдсэн` },
          );
        }
      }
      return message.reply({ embeds: [embed] });
    }

    const bet = parseInt(args[0]);
    if (!bet || bet <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!guess 500` → 1-100 хооронд тоо таа')] });
    if (bet > user.cash) return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    user.cash -= bet;
    saveUser(userId, user);
    activeGames.set(userId, { number: Math.floor(Math.random() * 100) + 1, bet, attempts: 0 });

    embed.setDescription(`🎮 1-100 хооронд тоо таа!\n💰 Bet: ₮${shortNum(bet)}\n5 оролдлого байна. Оролдлого бага байх тусам шагнал их!`);
    message.reply({ embeds: [embed] });
  },
};
