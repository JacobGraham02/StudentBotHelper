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

    async getBotDocument(bot_id: UUID) {

        try {
            const bot_document = await this.bot_repository.getBot(bot_id);

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
