import { Client, GatewayIntentBits, Events } from 'discord.js';
import { registerCommands, loadCommands} from './commands.js'
import dotenv from 'dotenv';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // These are the permissions the bot has
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

registerCommands(); // Register all commands

client.on(Events.InteractionCreate, async (interaction) => {
  loadCommands(interaction)
});

// Login bot
dotenv.config();
client.login(process.env.DISCORD_TOKEN);
