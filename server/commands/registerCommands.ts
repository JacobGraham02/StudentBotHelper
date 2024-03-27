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
            const discordToken = process.env.discord_bot_token;
            const botId = process.env.discord_bot_application_id;
            const guildId = interaction.guild?.id;
        
            const discord_client_instance_collection = new Collection();
            const commands_folder_path = path.join(__dirname);
            const filtered_commands_files = fs
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
                    await rest.put(Routes.applicationGuildCommands(botId, guildId), {
                        body: commands
                    });
                    // Use replied to ensure we don't reply more than once
                } catch (error) {
                    console.error("Error registering commands:", error);
                    // Check if a reply has already been sent to avoid trying to reply again
                }
            } else {
                // Check if a reply has already been sent to avoid trying to reply again
                if (!interaction.replied) {
                    await interaction.reply({ content: `Invalid bot, guild ID, or token. Could not register commands.`, ephemeral: true });
                }
            }
        

        return {
            discord_client_instance_collection
        };
      }
    }
    return setup_command_object;
}
