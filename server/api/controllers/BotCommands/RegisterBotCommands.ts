import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../../.env'});
import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from 'discord.js';
import ICommandModule from './ICommandModule';
import { Request, Response } from 'express';

export default class RegisterBotCommands {

    discord_token: string | undefined;
    discord_client_id: string | undefined;
    discord_guild_id: string | undefined;
    commands: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">[];
    commands_folder_path: string;
    commands_files: string[];
    filtered_commands_files: string[];

    constructor(discord_bot_token: string | undefined, discord_bot_client_id: string | undefined, discord_bot_guild_id: string | undefined) {
        if (typeof discord_bot_token !== 'undefined') {
            this.discord_token = discord_bot_token;
        }
        if (typeof discord_bot_client_id !== 'undefined') {
            this.discord_client_id = discord_bot_client_id;
        }
        if (typeof discord_bot_guild_id !== 'undefined') {
            this.discord_guild_id = discord_bot_guild_id;
        }
        this.commands = [];
        this.commands_folder_path = __dirname + '../../../commands/';
        this.commands_files = fs.readdirSync(this.commands_folder_path);
        this.filtered_commands_files = this.commands_files.filter(file => file !== 'deploy-commands.js');
    }

    async pushCommandsIntoCommandList(): Promise<void> {
        for(const command_file of this.filtered_commands_files) {
            const command_file_path: string = path.join(this.commands_folder_path, command_file);
            const command: ICommandModule = await import(command_file_path);
            const command_object: any = command.default();
            this.commands.push(command_object);
        }
    }

    async registerCommandsWithDiscordBot(request: Request, response: Response): Promise<void> {
        this.pushCommandsIntoCommandList().then(() => {
            if (typeof this.discord_token !== 'undefined' && typeof this.discord_client_id !== 'undefined' && typeof this.discord_guild_id !== 'undefined') {
                const rest: REST = new REST({version:'9'}).setToken(this.discord_token);

                rest.put(Routes.applicationGuildCommands(this.discord_client_id, this.discord_guild_id), {
                    body:this.commands
                }).then(() => {
                    console.log(`The application commands were successfully registered with the Discord bot`);
                    response.status(200).json({
                        message: `The application commands were successfully registered with the Discord bot`
                    })
                }).catch((error: Error) => {
                    console.error(`The application encountered an error when registering commands with the Discord bot. All environment variables are valid. ${error}`);
                    response.status(500).json({
                        message: `The application encountered an error when registering commands with the Discord bot. All environment variables are valid.`,
                        error: `${error}`
                    });
                });
            } else {
                console.error(`The application environment variables required to use this Discord bot are undefined`);
                response.status(500).json({
                    message: `The application environment variables required to use this Discord bot are undefined. Please try registering the commands again or contact the application developers`
                });
            }
        });
    }
}