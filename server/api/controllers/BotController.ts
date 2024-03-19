import axios = require("axios");
import BotRepository from "../../database/MongoDB/BotRepository";
import { DiscordBotInformationType } from "../../database/MongoDB/types/DiscordBotInformationType";
import { DiscordBotCommandType } from "../../database/MongoDB/types/DiscordBotCommandType";

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
            throw error;
        }
    }

    async insertBotCommandDocument(bot_command_information: DiscordBotCommandType) {

        try {
            await this.bot_repository.createBotCommand(bot_command_information);
        } catch (error: any) {
            console.error(`There was an error when attempting to insert the bot command into MongoDB by using the repository function 'createBotCommand': ${error}`);
            throw error;
        }
    }

    async getBotCommandDocument(command_name: string) {
        
        try {
            const bot_command_document = await this.bot_repository.getBotCommandDocument(command_name);
            return bot_command_document;
        } catch (error: any) {
            console.error(`There was an error when attempting to get a bot command from the MongoDB database: ${error}`);
            throw error;
        }
    }

    async getAllCommandDocuments() {

        try {
            const bot_command_documents = await this.bot_repository.getAllBotCommandDocuments();

            return bot_command_documents
        } catch (error: any) {
            console.error(`There was an error when attempting to fetch all bot comamnds from the MongoDB database: ${error}`);
            throw new Error(`There was an error when attempting to fetch all bot comamnds from the MongoDB database: ${error}`);
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
}