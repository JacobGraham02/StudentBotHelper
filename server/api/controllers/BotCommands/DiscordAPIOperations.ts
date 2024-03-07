import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from 'discord.js';
import ICommandModule from './ICommandModule';
import { Request, Response } from 'express';

export default class DiscordAPIOperations {

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

    private validateEnvironmentVariables(): boolean {
        return (typeof this.discord_token !== 'undefined' && typeof this.discord_client_id !== 'undefined' && typeof this.discord_guild_id !== 'undefined');
    }

    async registerCommandsWithDiscordBot(request: Request, response: Response): Promise<void> {
        if (!this.validateEnvironmentVariables()) {
            console.error(`The application encountered an error because not all of the required environment variables are valid`);
            response.status(500).json({
                message: `The application encountered an error because not all of the required environment variables are valid`
            });
            return;
        };
            
        this.pushCommandsIntoCommandList().then(() => {
            const rest: REST = new REST({ version: '9' }).setToken(this.discord_token!);
    
            if (typeof this.discord_client_id === 'undefined' || typeof this.discord_guild_id === 'undefined') {
                response.status(500).json({
                    message: `There was an internal server error that caused either the discord client id or discord guild id to not be set. 
                    Please contact the site administrator and inform them of this error`
                });
                return;
            }
            rest.put(Routes.applicationGuildCommands(this.discord_client_id, this.discord_guild_id), {
                body: this.commands
            }).then(() => {
                console.log(`The application commands were successfully registered with the Discord bot`);
                response.status(200).json({
                    message: `The application commands were successfully registered with the Discord bot`
                });
            }).catch((error: Error) => {
                console.error(`The application encountered an error when registering commands with the Discord bot. All environment variables are valid. ${error}`);
                response.status(500).json({
                    message: `The application encountered an error when registering commands with the Discord bot. All environment variables are valid.`,
                    error: `${error}`
                });
                throw error;
            });
        });
    }
    
    

    async changeDiscordBotName(request: Request, response: Response): Promise<void> {
        if (!this.validateEnvironmentVariables()) {
            console.error(`The application encountered an error because not all of the required environment variables are valid`);
            response.status(500).json({
                message: `The application encountered an error because not all of the required environment variables are valid`
            });
            return;
        }
        /*
        By default, all values obtained from request parameters will be a string. For example, 
        for the path /api/bot?botname=test, 'test' will always be parsed as a string if we obtain the 
        request parameter value by 'request.params.botname'. 
        */
        let new_discord_bot_name: string = request.params.botname;
        if (typeof new_discord_bot_name === 'undefined') {
            response.status(400).json({
                message: `The request could not be fulfilled because the bot name is not provided in the query parameters`
            });
        };
        if (typeof this.discord_token === 'undefined') {
            response.status(500).json({
                message: `There was an internal server error that caused the discord bot token to not be set. 
                Please contact the site administrator and inform them of this error`
            });
            return;
        }
        const rest: REST = new REST({ version: '9' }).setToken(this.discord_token);

        try {
            await rest.patch(Routes.user('@me'), {
                body: { username: new_discord_bot_name},
            });

            response.json({
                message: `The username of the bot has been successfully changed to ${new_discord_bot_name}`
            });
        } catch (error: any) {
            console.error(`There was an error when attempting to change the Discord bot username`);
            response.status(500).json({
                message: `There was an error when attempting to change the Discord bot username`,
                error: error
            });
            throw error;
        }
    }

    async changeDiscordBotAvatar(request: Request, response: Response): Promise<void> {
        if (!this.validateEnvironmentVariables()) {
            console.error(`The application encountered an error because not all of the required environment variables are valid`);
            response.status(500).json({
                message: `The application encountered an error because not all of the required environment variables are valid`
            });
            return;
        }
        let new_discord_bot_avatar_uri = request.params.botimagepath;
        if (typeof new_discord_bot_avatar_uri === 'undefined') {
            response.status(400).json({
                message: `The request could not be fulfilled because the image path for the new bot avatar is not provided in the query parameters`
            });
        };
        if (typeof this.discord_token === 'undefined') {
            response.status(500).json({
                message: `There was an internal server error that caused the discord bot token to not be set. 
                Please contact the site administrator and inform them of this error`
            });
            return;
        }
        const rest: REST = new REST({ version: '9' }).setToken(this.discord_token);

        try {
            let image_avatar_base64_data = await this.getImageAsBase64(new_discord_bot_avatar_uri);

            await rest.patch(Routes.user('@me'), {
                body: { avatar: image_avatar_base64_data }
            });

            response.status(200).json({
                message: `The Discord bot avatar was updated successfully`
            });
        } catch (error: any) {
            console.error(`There was an error when attempting to set the Discord bot avatar: ${error}`);
            response.status(500).json({
                message: `There was an internal server error when attempting to update the Discord bot avatar. Please inform the site administrator of this error`
            });
            throw error;
        }
    }

    private async getImageAsBase64(uri: string): Promise<string> {
        if (uri.startsWith('http') || uri.startsWith('https')) {
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        } else {
            const filePath = path.resolve(uri);
            const fileData = fs.readFileSync(filePath);
            return fileData.toString('base64');
        }
    }
}