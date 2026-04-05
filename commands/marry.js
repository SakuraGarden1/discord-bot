const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

const proposals = new Map();

module.exports = {
  name: 'marry',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const embed = new EmbedBuilder().setColor(0xFFC0CB);

    // !marry accept / decline
    if (args[0]?.toLowerCase() === 'accept') {
      const proposerId = proposals.get(userId);
      if (!proposerId) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Танд гэрлэлтийн санал байхгүй.')] });

      const proposer = getUser(proposerId);
      user.married = proposerId;
      proposer.married = userId;
      proposals.delete(userId);

      saveUser(userId, user);
      saveUser(proposerId, proposer);

      embed.setTitle('💍 Гэрлэлт бүртгэгдлээ! 🎉')
        .setDescription(`💑 **${message.author.username}** & **<@${proposerId}>** хосууд боллоо!`);
      return message.reply({ embeds: [embed] });
    }

    if (args[0]?.toLowerCase() === 'decline') {
      const proposerId = proposals.get(userId);
      if (!proposerId) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Санал байхгүй.')] });
      proposals.delete(userId);
      embed.setTitle('💍 Гэрлэлт').setDescription('❌ Гэрлэлтийн санал татгалзлаа.');
      return message.reply({ embeds: [embed] });
    }

    if (args[0]?.toLowerCase() === 'divorce') {
      if (!user.married) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Та одоо гэрлээгүй байна.')] });
      const exId = user.married;
      const ex = getUser(exId);
      user.married = null;
      ex.married = null;
      saveUser(userId, user);
      saveUser(exId, ex);
      embed.setTitle('💔 Салалт').setDescription(`💔 **${message.author.username}** салалт хийлээ.`);
      return message.reply({ embeds: [embed] });
    }

    // Санал тавих
    const target = message.mentions.users.first();
    if (!target) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Жишээ: `!marry @user`')] });
    if (target.id === userId) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Өөртэйгөө гэрлэж болохгүй!')] });
    if (target.bot) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Bot-тай гэрлэж болохгүй!')] });

    if (user.married) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Та аль хэдийн гэрлэсэн байна! Эхлээд `!marry divorce` хийнэ үү.')] });

    const targetUser = getUser(target.id);
    if (targetUser.married) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription(`❌ **${target.username}** аль хэдийн гэрлэсэн байна.`)] });

    // Бөгж шалгах
    const inv = user.inventory || {};
    const hasRing = inv.ring_diamond > 0 || inv.ring_gold > 0 || inv.ring_silver > 0;
    if (!hasRing) return message.reply({ embeds: [embed.setTitle('💍 Гэрлэлт').setDescription('❌ Гэрлэхийн тулд бөгж хэрэгтэй!\n🏪 `!shop` дээр бөгж авна уу (₮5M+).')] });

    // Бөгжийг хэрэглэх
    if (inv.ring_diamond > 0) inv.ring_diamond--;
    else if (inv.ring_gold > 0) inv.ring_gold--;
    else if (inv.ring_silver > 0) inv.ring_silver--;
    user.inventory = inv;
    saveUser(userId, user);

    proposals.set(target.id, userId);

    embed.setTitle('💍 Гэрлэлтийн санал!')
      .setDescription(`💍 **${message.author.username}** таны гэрлэлтийн санал тавив **${target.username}**!`)
      .addFields({ name: '📩 Хариулахдаа', value: '`!marry accept` — зөвшөөрөх\n`!marry decline` — татгалзах' });
    message.reply({ content: `<@${target.id}>`, embeds: [embed] });
  },
};
