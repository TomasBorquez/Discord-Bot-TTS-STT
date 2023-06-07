import { Collection, REST, Routes } from "discord.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();
const commands = new Collection();
export async function loadCommands(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return console.log(`No ${interaction.commandName}`);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
  }
}

export async function registerCommands() {
  const commandsArr = [];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const commandsPath = join(__dirname, "commands");
  const categoriesFolders = fs.readdirSync(commandsPath);

  for (const categoryFolders of categoriesFolders) {
    const commandsFolderPath = join(commandsPath, categoryFolders);
    const commandsFolders = fs.readdirSync(commandsFolderPath);

    for (const commandFolder of commandsFolders) {
      const commandPath = join(commandsPath, categoryFolders, commandFolder, 'index.js');
      const command = await import(commandPath);

      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
        commandsArr.push(command.data.toJSON());
        console.log(`Command at ${commandPath} - ✅`);
      } else {
        console.log(`Command at ${commandPath} - ❌`);
      }
    }
  }
  refreshCommands(commandsArr)
}

function refreshCommands(commands) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  return rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  })
}
