const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { isProtected } = require('./protected_roles');

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
  if (command.aliases) command.aliases.forEach(a => client.aliases.set(a, command.name));
}

const DRUNK_DECAY_MS = 60 * 60 * 1000;

client.on('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  const { decayAllUsersDrunk } = require('./db');
  const tick = () => {
    try {
      decayAllUsersDrunk();
    } catch (e) {
      console.error('[decayAllUsersDrunk]', e);
    }
  };
  setInterval(tick, DRUNK_DECAY_MS);
});

const cooldowns = new Map();
const SPAM_COOLDOWN = 1500;

// Согтолтоос хамааралгүй команд
const ALWAYS_ALLOWED = ['pub', 'cigarshop', 'help', 'balance', 'bal', 'profile', 'pro'];

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

  // Согтолт шалгах
  if (!ALWAYS_ALLOWED.includes(resolvedName)) {
    try {
      const { getUser } = require('./db');
      const user = getUser(message.author.id);
      const hasStaffRole = !!message.member && isProtected(message.member);
      const drunkBypassForRob = (resolvedName === 'rob' || resolvedName === 'bankrob') && hasStaffRole;
      if ((user.drunk || 0) >= 6 && !drunkBypassForRob) {
        const responses = [
          '🥴 Та хэтэрхий согтсон тул энэ командыг ашиглах боломжгүй!',
          '🍺 Та согтсон байна... юу хийж байгаагаа ч мэдэхгүй юм шиг байна!',
          '🥃 Гараа хүргэж чадахгүй байна... хэтэрхий согтсон!',
        ];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
      }
    } catch (e) {
      console.error('[drunk gate]', e);
    }
  }

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('❌ Алдаа гарлаа.').catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
