const { getUser, saveUser } = require('../db');
const { rand, shortNum } = require('../economy');
const { isProtected } = require('../protected_roles');
const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 60 * 60 * 1000;

module.exports = {
  name: 'rob',
  async execute(message, args) {
    const userId = message.author.id;
    const target = message.mentions.users.first();
    const embed = new EmbedBuilder().setColor(0xE8B84B).setTitle('🦹 Rob');

    if (!target) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!rob @user`')] });
    if (target.id === userId) return message.reply({ embeds: [embed.setDescription('❌ Өөрөөсөө хулгайлах боломжгүй!')] });
    if (target.bot) return message.reply({ embeds: [embed.setDescription('❌ Bot-оос хулгайлах боломжгүй!')] });

    try {
      const targetMember = await message.guild.members.fetch(target.id);
      if (isProtected(targetMember)) return message.reply({ embeds: [embed.setDescription(`🛡️ **${target.username}** Staff тул хулгайлах боломжгүй!`)] });
    } catch {}

    const robber = getUser(userId);
    const victim = getUser(target.id);
    const now = Date.now();

    if (now - robber.lastRob < COOLDOWN) {
      const left = Math.ceil((COOLDOWN - (now - robber.lastRob)) / 60000);
      return message.reply({ embeds: [embed.setDescription(`⏳ **${left} минут** дараа дахин хулгайлж болно.`)] });
    }

    if (victim.cash <= 0) return message.reply({ embeds: [embed.setDescription(`❌ **${target.username}**-д cash байхгүй!`)] });

    if (victim.inventory?.rob_shield) {
      victim.inventory.rob_shield = false;
      robber.lastRob = now;
      saveUser(userId, robber);
      saveUser(target.id, victim);
      return message.reply({ embeds: [embed.setDescription(`🛡️ **${target.username}** Rob Shield-ээр хамгаалагдсан!`)] });
    }

    // Police Protection шалгах
    if (victim.inventory?.police_protect && Math.random() < 0.30) {
      const fine = rand(500, 2000);
      robber.cash = Math.max(0, robber.cash - fine);
      robber.lastRob = now;
      saveUser(userId, robber);
      embed.addFields(
        { name: '👮 Police Protection!', value: `**${target.username}**-ын цагдаа хамгаалалт ажиллалаа!` },
        { name: '💸 Торгууль', value: `₮${shortNum(fine)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(robber.cash)}`, inline: true },
      );
      return message.reply({ embeds: [embed] });
    }

    robber.lastRob = now;
    const success = Math.random() < 0.45;

    if (success) {
      const stolen = rand(Math.floor(victim.cash * 0.1), Math.floor(victim.cash * 0.4));
      robber.cash += stolen;
      victim.cash -= stolen;
      saveUser(userId, robber);
      saveUser(target.id, victim);
      embed.addFields(
        { name: '✅ Амжилттай!', value: `**${target.username}**-аас хулгайлав` },
        { name: '💰 Хулгайласан', value: `₮${shortNum(stolen)}`, inline: true },
        { name: '👛 Таны cash', value: `₮${shortNum(robber.cash)}`, inline: true },
      );
    } else {
      const fine = rand(100, 500);
      robber.cash = Math.max(0, robber.cash - fine);
      saveUser(userId, robber);
      embed.addFields(
        { name: '👮 Баригдлаа!', value: 'Цагдаа баривчиллаа' },
        { name: '💸 Торгууль', value: `₮${shortNum(fine)}`, inline: true },
        { name: '👛 Cash', value: `₮${shortNum(robber.cash)}`, inline: true },
      );
    }
    message.reply({ embeds: [embed] });
  },
};
