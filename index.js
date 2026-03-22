const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => client.aliases.set(alias, command.name));
  }
}

client.on('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

const cooldowns = new Map();
const SPAM_COOLDOWN = 1500;

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const resolvedName = client.aliases.get(commandName) || commandName;
  const command = client.commands.get(resolvedName);
  if (!command) return;

  const key = `${message.author.id}-${resolvedName}`;
  const now = Date.now();
  if (cooldowns.has(key) && now - cooldowns.get(key) < SPAM_COOLDOWN) return;
  cooldowns.set(key, now);

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('❌ Алдаа гарлаа. Дахин оролдоно уу.').catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
