import axios = require("axios");
import BotRepository from "../../database/MongoDB/BotRepository";
import { DiscordBotInformationType } from "../../database/MongoDB/types/DiscordBotInformationType";
import { DiscordBotCommandType } from "../../database/MongoDB/types/DiscordBotCommandType";
import { UUID } from "crypto";

export default class BotController {
  bot_repository: BotRepository;

  constructor(bot_repository_database_instance: BotRepository) {
    this.bot_repository = bot_repository_database_instance;
  }

    async insertBotDocumentIntoMongoDB(bot_document_information: DiscordBotInformationType) {

        try {
            await this.bot_repository.createBot(bot_document_information);
        } catch (error: any) {
            console.error(`There was an error when attempting to insert the bot document into MongoDB by using the repository function 'createBot': ${error}`);
            throw new Error(`There was an error when attempting to insert the bot document into MongoDB by using the repository function 'createBot': ${error}`);
        }
    }

    async insertBotCommandDocument(bot_command_information: DiscordBotCommandType) {

        try {
            await this.bot_repository.createBotCommand(bot_command_information);
        } catch (error: any) {
            console.error(`There was an error when attempting to insert the bot command into MongoDB by using the repository function 'createBotCommand': ${error}`);
            throw new Error(`There was an error when attempting to insert the bot command into MongoDB by using the repository function 'createBotCommand': ${error}`);
        }
    }

    async updateBotId(bot_id: UUID) {
        const updateBotId: DiscordBotInformationType = {
            bot_id: bot_id
        }
        try {
            await this.bot_repository.createBot(updateBotId);
        } catch (error: any) {
            console.error(`There was an error when attempting to change the bot id: ${error}`);
            throw new Error(`There was an error when attempting to change the bot id: ${error}`);
        }
    }

    async updateBotChannelIds(bot_channels: DiscordBotInformationType) {
        const updateBotChannels: DiscordBotInformationType = {
            bot_id: bot_channels.bot_id,
            bot_guild_id: bot_channels.bot_guild_id,
            bot_commands_channel_id: bot_channels.bot_commands_channel_id,
            bot_command_usage_information_channel_id: bot_channels.bot_command_usage_information_channel_id,
            bot_command_usage_error_channel_id: bot_channels.bot_command_usage_error_channel_id,
            bot_role_button_channel_id: bot_channels.bot_role_button_channel_id
        }

        try {
            const update_bot_channel_id = await this.bot_repository.updateBotChannelIds(updateBotChannels);

            return update_bot_channel_id;
        } catch (error: any) {
            console.error(`There was an error when attempting to update the bot channel ids: ${error}`);
            throw new Error(`There was an error when attempting to update the bot channel ids: ${error}`);
        }   
    }

    async getAllCommandFiles() {

        try {
            const bot_command_documents = await this.bot_repository.getAllBotCommandFiles();

            const commands_array = Array.isArray(bot_command_documents) ? bot_command_documents : [bot_command_documents]

            return commands_array
        } catch (error: any) {
            console.error(`There was an error when attempting to fetch all bot commands: ${error}`);
            throw new Error(`There was an error when attempting to fetch all bot commands: ${error}`);
        }
    }

    async getBotDocument(bot_email: string) {

        try {
            const bot_document = await this.bot_repository.findBotByEmail(bot_email);

            return bot_document;
        } catch (error) {
            console.error(`There was an error when attempting to fetch the bot document from the MongoDB database: ${error}`);
            throw new Error(`There was an error when attempting to fetch the bot document from the MongoDB database. Please try again or inform the server administrator of this error: ${error}`);
        }
    }

    async getAllLogFilesFromContainer(containerName: string) {

        try {
            const azure_container_logs = await this.bot_repository.readAllLogsFromAzureContainer(containerName);

            return azure_container_logs;
        } catch (error: any) {
            console.error(`There was an error when attempting to get all log files from the container ${containerName}: ${error}`);
            throw new Error(`There was an error when attempting to get all log files from the container ${containerName}: ${error}`);
        }
    }

    async writeLogFileToContainer(logFileName: string, containerName: string, fileContents: string, ) {

        try {   
            await this.bot_repository.writeLogToAzureContainer(logFileName, fileContents, containerName);
        } catch (error: any) {
            console.error(`There was an error when attempting to write a log file to a container: ${containerName}: ${error}`);
            throw new Error(`There was an error when attempting to write a log file to a container: ${containerName}: ${error}`)
        }
    }

    // async writeCommandFileToContainer(commandFile: ICommandFileStructure, containerName: string) {
    //     try {
    //         const azure_container_commands = await this.bot_repository.writeCommandToContainer(commandFile, containerName);

    //         return azure_container_commands;
    //     } catch (error: any) {
    //         console.error(`There was an error when attempting to write a command file to the container: ${containerName}: ${error}`);
    //         throw new Error(`There was an error when attempting to write a command file to the container: ${containerName}: ${error}`);
    //     }
    // }
}
