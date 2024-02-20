import { SlashCommandBuilder } from "discord.js";

export default interface CommandModule {
    default:() => {
        data: ReturnType<SlashCommandBuilder['toJSON']>;
        execute: (interaction: any) => Promise<void>;
        authorization_role_name: string[];
    };
}