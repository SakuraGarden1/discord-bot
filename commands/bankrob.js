const { getUser, saveUser } = require('../db');
const { rand, shortNum } = require('../economy');
const { isProtected } = require('../protected_roles');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 3 * 60 * 60 * 1000;

module.exports = {
  name: 'bankrob',
  aliases: ['br'],
  async execute(message, args) {
    const userId = message.author.id;
    const target = message.mentions.users.first();
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('🏦 Банкны дээрэм');

    if (!target) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!bankrob @user`')] });
    if (target.id === userId) return message.reply({ embeds: [embed.setDescription('❌ Өөрийнхөө банкийг дээрэмдэж болохгүй!')] });
    if (target.bot) return message.reply({ embeds: [embed.setDescription('❌ Bot-ийн банкийг дээрэмдэж болохгүй!')] });

    try {
      const targetMember = await message.guild.members.fetch(target.id);
      if (isProtected(targetMember)) {
        return message.reply({ embeds: [embed.setDescription(`🛡️ **${target.username}** Staff гишүүн тул банкийг нь дээрэмдэх боломжгүй!`)] });
      }
    } catch {}

    const robber = getUser(userId);
    const victim = getUser(target.id);
    const now = Date.now();

    if (now - (robber.lastBankRob || 0) < COOLDOWN) {
      const left = Math.ceil((COOLDOWN - (now - robber.lastBankRob)) / 60000);
      return message.reply({ embeds: [embed.setDescription(`⏳ **${left} минут** дараа дахин банк дээрэмдэж болно.`)] });
    }

    if (victim.bank <= 0) return message.reply({ embeds: [embed.setDescription(`❌ **${target.username}**-ын банкинд мөнгө байхгүй!`)] });

    robber.lastBankRob = now;
    const success = Math.random() < 0.35;

    if (success) {
      const stolen = rand(Math.floor(victim.bank * 0.05), Math.floor(victim.bank * 0.20));
      robber.cash += stolen;
      victim.bank -= stolen;
      saveUser(userId, robber);
      saveUser(target.id, victim);
      embed.addFields(
        { name: '✅ Амжилттай!', value: `**${target.username}**-ын банкнаас хулгайлав` },
        { name: '💰 Хулгайласан', value: `₮${shortNum(stolen)}`, inline: true },
        { name: '👛 Таны cash', value: `₮${shortNum(robber.cash)}`, inline: true },
      );
    } else {
      const fine = rand(1000, 5000);
      robber.cash = Math.max(0, robber.cash - fine);
      saveUser(userId, robber);
      embed.addFields(
        { name: '👮 Баригдлаа!', value: 'Банкны хамгаалалт ажиллалаа' },
        { name: '💸 Торгууль', value: `₮${shortNum(fine)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(robber.cash)}`, inline: true },
      );
    }
    message.reply({ embeds: [embed] });
  },
};
