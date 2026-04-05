const { getUser, saveUser } = require('../db');
const { shortNum } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pay',
  async execute(message, args) {
    const userId = message.author.id;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    const embed = new EmbedBuilder().setColor(0xFFC0CB).setTitle('💸 Pay');

    if (!target) return message.reply({ embeds: [embed.setDescription('❌ Жишээ: `!pay @user 1000`')] });
    if (target.id === userId) return message.reply({ embeds: [embed.setDescription('❌ Өөртөө илгээх боломжгүй!')] });
    if (!amount || amount <= 0) return message.reply({ embeds: [embed.setDescription('❌ Зөв дүн оруул.')] });

    const sender = getUser(userId);
    const receiver = getUser(target.id);

    if (amount > sender.cash) return message.reply({ embeds: [embed.setDescription(`❌ Cash хүрэлцэхгүй! ₮${shortNum(sender.cash)}`)] });

    sender.cash -= amount;
    receiver.cash += amount;
    saveUser(userId, sender);
    saveUser(target.id, receiver);

    embed.addFields(
      { name: '💸 Илгээсэн', value: `₮${shortNum(amount)}`, inline: true },
      { name: '👤 Хүлээн авсан', value: target.username, inline: true },
      { name: '👛 Таны cash', value: `₮${shortNum(sender.cash)}`, inline: true },
    );
    message.reply({ embeds: [embed] });
  },
};
