import { instance } from "../index.ts";
import { Bot, BotCommand, BotConfiguration } from "../../pages/types/BotTypes.ts";

export const postBotConfigurations = async (botConfiguration: BotConfiguration) => {
  try {
    const postBotConfigurationResponse = await instance.post("bot/configs", botConfiguration);

    return postBotConfigurationResponse;

  } catch (error) {
    console.error(`There was an error when attempting to post the bot configuration options to the MongoDB database: ${error}`);
    throw new Error(`There was an error when attempting to post the bot configuration options to the MongoDB database: ${error}`);
  }
};

export const postBotCommands = async (botCommand: BotCommand) => {
  try {
      const postBotCommandsResponse = await instance.post("api/bot/commands", botCommand);
    
      return postBotCommandsResponse;

  } catch (error) {
      console.error(`There was an error when attempting to post the bot command options to the MongoDB database: ${error}`);
      throw new Error(`There was an error when attempting to post the bot command options to the MongoDB database: ${error}`);
  }
}

export const postBotRegister = async (bot: Bot) => {
  try {
    const postBotResponse = await instance.post("api/bot/create", bot);

    return postBotResponse;
  } catch (error) {
    console.error(`There was an error when attempting to post the bot data to the MongoDB database: ${error}`);
    throw new Error(`There was an error when attempting to post the bot data to the MongoDB database: ${error}`);
  }
}

export const postBotRequestCommand = async (botCommand: BotCommand) => {
  try {
    const postBotRequestCommandResponse = await instance.post("api/bot/newcommandrequest", botCommand);
    
    return postBotRequestCommandResponse;
  } catch (error) {
    console.error(`There was an error when attempting to send an email to the server administrator requesting an email: ${error}`);
    throw new Error(`There was an error when attempting to send an email to the server administrator requesting an email: ${error}`);
  }
}