import path from "path";
import CustomDiscordClient from "../utils/CustomDiscordClient";
import { Collection, REST, Routes } from "discord.js";
import fs from "fs";

import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default function() {
    const setup_command_object: Object = {
        data: new SlashCommandBuilder()
            .setName('registercommands')
            .setDescription('Add admin commands to your Discord server'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            registerCommands();
        }
    }
    return setup_command_object;
}


const registerCommands = async (discordToken: string, botId: string, guildId: string, discordClientInstance: CustomDiscordClient) => {
    const commands_folder_path: string = path.join(__dirname, "./commands");
    const filtered_commands_files: string[] = fs
        .readdirSync(commands_folder_path)
        .filter((file) => file !== "deploy-commands.ts" && !file.endsWith(".map"));
    discordClientInstance.discord_commands = new Collection();
  
    const commands: any[] = [];
  
    for (const command_file of filtered_commands_files) {
      const command_file_path = path.join(commands_folder_path, command_file);
      const command = await import(command_file_path);
      const command_object = command.default();
      
      discordClientInstance.discord_commands.set(command_object.data.name, command_object);
  
      // Check if the bot ID array in the command matches the target bot ID and if the guild ID matches
      if (
        command_object.bot_id.includes(botId) && // Check if bot_id array contains botId
        command_object.guild_id.includes(guildId) // Check if guild_id array contains guildId
      ) {
        commands.push(command_object.data);
      }
    }
  
    if (discordToken && botId && guildId) {
      const rest = new REST({ version: '10' }).setToken(discordToken);
  
      rest.put(Routes.applicationGuildCommands(botId, guildId), {
        body: commands
      }).then(() => {
        console.log('The bot commands were successfully registered');
      }).catch((error) => {
        console.error(`The application encountered an error when registering the commands with the discord bot. All environment variables were valid. ${error}`);
      });
    } else {
      console.error(`The discord client id, guild id, or bot token was invalid when trying to register commands with the bot`);
    }
  };