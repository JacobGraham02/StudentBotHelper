import path from "path";
import { Collection, REST, Routes } from "discord.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const setup_command_object: Object = {
        data: new SlashCommandBuilder()
            .setName('registercommands')
            .setDescription('Add admin commands to your Discord server'),
        authorization_role_name: ["Discord admin"],
        
        async execute(interaction) {
          if (interaction.replied) {
             console.log(`There reply for the registerCommands interaction has already taken place`);
             return;
          }
          const discordToken = process.env.discord_bot_token;
          const botId = process.env.discord_bot_application_id;
          const guildId = interaction.guild?.id;

          const discord_client_instance_collection = new Collection();
          const commands_folder_path: string = path.join(__dirname);
          const filtered_commands_files: string[] = fs
              .readdirSync(commands_folder_path)
              .filter((file) => file !== "deploy-commands.ts" && !file.endsWith(".map"));
        
          const commands: any[] = [];
        
          for (const command_file of filtered_commands_files) {
            const command_file_path = path.join(commands_folder_path, command_file);
            const command = await import(command_file_path);
            const command_object = command.default();

            discord_client_instance_collection.set(command_object.data.name, command_object);
          
            commands.push(command_object.data);
          }
        
          if (discordToken && botId && guildId) {
            const rest = new REST({ version: '10' }).setToken(discordToken);
        
            try {
              // Removed the direct interaction.reply call here
              await rest.put(Routes.applicationGuildCommands(botId, guildId), {
                body: commands
              });
              
              // Moved the interaction.reply call into the try block
              await interaction.reply({content: `The commands have been registered with your discord bot`, ephemeral: true});
              console.log(`The commands have been registered with your discord bot`);
            } catch (error) {
              // Added a catch block to handle errors during rest.put
              await interaction.editReply({content: `There was an error registering the commands with your bot. Please inform the bot developer of the following error: ${error}`, ephemeral: true});
              console.error(`Error registering commands with the bot:`, error);
            }
          } else {
            await interaction.editReply({content: `The discord bot token, bot id, or token id was invalid when trying to register the commands with your bot. Please inform the bot developer of this error`, ephemeral: true});
            console.error(`The discord client id, guild id, or bot token was invalid when trying to register commands with the bot`);
          }

          return {
              discord_client_instance_collection
          };
        }
    }
    return setup_command_object;
}
