const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'crash',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const bet = parseInt(args[0]);
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('🚀 Crash');

    if (!bet || bet <= 0) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!crash 500`')] });
    if (bet > user.cash) return message.reply({ embeds: [embed.setDescription('❌ Хангалттай мөнгө байхгүй!')] });

    user.cash -= bet;

    // Crash multiplier
    const crash = parseFloat((1 + Math.random() * 9).toFixed(2));
    const cashout = parseFloat((1 + Math.random() * (crash - 0.5)).toFixed(2));

    const msg = await message.reply({ embeds: [embed.setDescription(`🚀 Нисч байна...\n💰 Bet: ₮${shortNum(bet)}`)] });

    // Animate
    let current = 1.00;
    const interval = setInterval(async () => {
      current = parseFloat((current + 0.1).toFixed(2));
      if (current >= cashout || current >= crash) {
        clearInterval(interval);
        if (current < crash) {
          // Амжилттай cash out
          const win = Math.floor(bet * cashout);
          user.cash += win;
          saveUser(userId, user);
          const e = new EmbedBuilder().setColor(0xff69b4).setTitle('🚀 Crash — Cash Out!')
            .addFields(
              { name: '✅ Cash Out', value: `x${cashout}`, inline: true },
              { name: '💥 Crash', value: `x${crash}`, inline: true },
              { name: '💰 Хожлоо', value: `+₮${shortNum(win)}`, inline: true },
              { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
            );
          await msg.edit({ embeds: [e] });
        } else {
          saveUser(userId, user);
          const e = new EmbedBuilder().setColor(0xff0000).setTitle('🚀 CRASH! 💥')
            .addFields(
              { name: '💥 Crash at', value: `x${crash}`, inline: true },
              { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
              { name: '👛 Cash', value: `₮${shortNum(user.cash)}`, inline: true },
            );
          await msg.edit({ embeds: [e] });
        }
      } else {
        const e = new EmbedBuilder().setColor(0xff69b4).setTitle('🚀 Crash')
          .setDescription(`📈 **x${current.toFixed(2)}**\n💰 Bet: ₮${shortNum(bet)}`);
        await msg.edit({ embeds: [e] }).catch(() => {});
      }
    }, 800);
  },
};
