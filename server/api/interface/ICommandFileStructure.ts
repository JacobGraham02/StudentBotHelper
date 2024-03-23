import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default interface Command {
    data: SlashCommandBuilder;
    authorization_role_name: string[];
    execute: (interaction: CommandInteraction) => Promise<void>;
}
