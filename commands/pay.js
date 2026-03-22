const { getUser, saveUser, addToOwner } = require('../db');
const { applyTax } = require('../economy');

module.exports = {
  name: 'pay',
  async execute(message, args) {
    const userId = message.author.id;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) return message.reply('❌ Хэнд илгээхээ заа. Жишээ: `!pay @user 1000`');
    if (target.id === userId) return message.reply('❌ Өөртөө мөнгө илгээх боломжгүй!');
    if (target.bot) return message.reply('❌ Bot руу мөнгө илгээх боломжгүй!');
    if (!amount || amount <= 0) return message.reply('❌ Зөв дүн оруул. Жишээ: `!pay @user 1000`');

    const sender = getUser(userId);
    const receiver = getUser(target.id);

    if (amount > sender.cash) return message.reply(`❌ Хангалттай cash байхгүй! Таны cash: ₮${sender.cash.toLocaleString()}`);

    const { net, tax } = applyTax(amount);
    sender.cash -= amount;
    receiver.cash += net;
    addToOwner(tax);

    saveUser(userId, sender);
    saveUser(target.id, receiver);

    message.reply(
      `💸 **${message.author.username}** → **${target.username}**\n` +
      `💵 Илгээсэн: ₮${amount.toLocaleString()}\n` +
      `🏦 Татвар (5%): ₮${tax.toLocaleString()}\n` +
      `✅ Хүлээн авсан: **₮${net.toLocaleString()}**\n` +
      `👛 Таны үлдэгдэл: ₮${sender.cash.toLocaleString()}`
    );
  },
};
