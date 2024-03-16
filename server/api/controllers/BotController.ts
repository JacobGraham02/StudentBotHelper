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
}