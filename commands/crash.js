const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const CASHOUT = '💰';

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
    saveUser(userId, user);

    let current = 1.00;
    let crashed = false;
    let cashedOut = false;

    const msg = await message.reply({
      embeds: [new EmbedBuilder().setColor(0xff69b4).setTitle('🚀 Crash')
        .setDescription(`📈 **x${current.toFixed(2)}**\n💰 Bet: ₮${shortNum(bet)}\n\n${CASHOUT} дарж cash out хийнэ!`)]
    });
    await msg.react(CASHOUT);

    // Reaction collector
    const filter = (r, u) => r.emoji.name === CASHOUT && u.id === userId;
    const collector = msg.createReactionCollector({ filter, time: 30000, max: 1 });

    collector.on('collect', () => {
      if (!crashed) cashedOut = true;
    });

    // Multiplier өсгөх loop
    const interval = setInterval(async () => {
      if (cashedOut || crashed) {
        clearInterval(interval);
        return;
      }

      // 10% хожих, 90% crash магадлал — multiplier өсөх тусам crash магадлал нэмэгдэнэ
      const crashChance = 0.15 + (current - 1) * 0.25;
      if (Math.random() < crashChance) {
        crashed = true;
        clearInterval(interval);
        collector.stop();

        const freshUser = getUser(userId);
        const e = new EmbedBuilder().setColor(0xff0000).setTitle('💥 CRASH!')
          .addFields(
            { name: '💥 Crash at', value: `x${current.toFixed(2)}`, inline: true },
            { name: '💸 Алдсан', value: `-₮${shortNum(bet)}`, inline: true },
            { name: '👛 Cash', value: `₮${shortNum(freshUser.cash)}`, inline: true },
          );
        await msg.edit({ embeds: [e] }).catch(() => {});
        return;
      }

      current = parseFloat((current + 0.10 + Math.random() * 0.15).toFixed(2));

      const e = new EmbedBuilder().setColor(0xff69b4).setTitle('🚀 Crash')
        .setDescription(`📈 **x${current.toFixed(2)}**\n💰 Bet: ₮${shortNum(bet)}\n\n${CASHOUT} дарж cash out хийнэ!`);
      await msg.edit({ embeds: [e] }).catch(() => {});
    }, 1500);

    // Cash out хийгдвэл
    collector.on('end', async (collected) => {
      if (!cashedOut) return;
      clearInterval(interval);

      const win = Math.floor(bet * current);
      const freshUser = getUser(userId);
      freshUser.cash += win;
      saveUser(userId, freshUser);

      const e = new EmbedBuilder().setColor(0x00ff00).setTitle('💰 Cash Out!')
        .addFields(
          { name: '✅ Cash Out', value: `x${current.toFixed(2)}`, inline: true },
          { name: '💰 Хожлоо', value: `+₮${shortNum(win - bet)}`, inline: true },
          { name: '👛 Cash', value: `₮${shortNum(freshUser.cash)}`, inline: true },
        );
      await msg.edit({ embeds: [e] }).catch(() => {});
    });
  },
};
