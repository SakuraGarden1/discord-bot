const { getUser, saveUser } = require('../db');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'use',
  async execute(message, args) {
    const userId = message.author.id;
    const user = getUser(userId);
    const item = args[0]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(0xE8B84B);

    if (item === 'luckycharm' || item === 'lucky') {
      const count = user.inventory?.lucky_charm || 0;
      if (count <= 0) return message.reply({ embeds: [embed.setTitle('🎰 Lucky Charm').setDescription('❌ Lucky Charm байхгүй байна! `!buy 3` гэж авна уу.')] });

      user.inventory.lucky_charm = count - 1;
      if (!user.inventory.lucky_charm_active) user.inventory.lucky_charm_active = 0;
      user.inventory.lucky_charm_active += 10;
      saveUser(userId, user);

      embed.setTitle('🎰 Lucky Charm ашиглалаа!')
        .addFields(
          { name: '✨ Нэмэгдсэн', value: '+10 lucky боломж', inline: true },
          { name: '🎯 Нийт үлдсэн', value: `${user.inventory.lucky_charm_active} удаа`, inline: true },
          { name: '🎰 Lucky Charm', value: `${user.inventory.lucky_charm} ширхэг үлдсэн`, inline: true },
        );
      return message.reply({ embeds: [embed] });
    }

    embed.setTitle('❓ Use').setDescription('Ашиглах боломжтой items:\n`!use luckycharm` — Lucky Charm идэвхжүүлэх');
    message.reply({ embeds: [embed] });
  },
};
