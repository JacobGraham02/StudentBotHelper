import axios = require("axios");
import BotRepository from "../../database/MongoDB/BotRepository";
import IDiscordBotInformation from "../../database/MongoDB/IDiscordBotInformation";

export default class BotController {
  bot_repository: BotRepository;

  constructor(bot_repository_database_instance: BotRepository) {
    this.bot_repository = bot_repository_database_instance;
  }

  async insertBotDocumentIntoMongoDB(bot_document_information: any) {
    try {
      await this.bot_repository.createBot(bot_document_information);
    } catch (error: any) {
      console.error(
        `There was an error when attempting to insert the bot document into MongoDB by using the repository function 'createBot': ${error}`
      );
      throw error;
    }
  }
}
