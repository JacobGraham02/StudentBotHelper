import { instance } from "../index.ts";
import { Bot, BotCommand, BotConfiguration } from "../../pages/types/BotTypes.ts";
import { UserInfo } from "../../pages/types/UserTypes.ts";

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
      const postBotCommandsResponse = await instance.post("bot/commands", botCommand);
    
      return postBotCommandsResponse;

  } catch (error) {
      console.error(`There was an error when attempting to post the bot command options to the MongoDB database: ${error}`);
      throw new Error(`There was an error when attempting to post the bot command options to the MongoDB database: ${error}`);
  }
}

export const postBotRegister = async (bot: Bot) => {
  try {
    const postBotResponse = await instance.post("bot/create", bot);

    return postBotResponse;
  } catch (error) {
    console.error(`There was an error when attempting to post the bot data to the MongoDB database: ${error}`);
    throw new Error(`There was an error when attempting to post the bot data to the MongoDB database: ${error}`);
  }
}

export const postBotRequestCommand = async (botCommand: BotCommand) => {
  try {
    const postBotRequestCommandResponse = await instance.post("bot/newcommandrequest", botCommand);
    
    return postBotRequestCommandResponse;
  } catch (error) {
    console.error(`There was an error when attempting to send an email to the server administrator requesting an email: ${error}`);
    throw new Error(`There was an error when attempting to send an email to the server administrator requesting an email: ${error}`);
  }
}

export const postChangeUserOptions = async (userOptions: UserInfo) => {
  try {
    const postBotRequestCommandResponse = await instance.post("user/changeuserdata", userOptions);
    
    return postBotRequestCommandResponse;
  } catch (error) {
    console.error(`There was an error when attempting to change the user profile data: ${error}`);
    throw new Error(`There was an error when attempting to change the user profile data: ${error}`);
  }
}


export const getAllBotCommands = async () => {
  try {
    const allBotCommandDocuments = await instance.get("bot/getcommands");

    return allBotCommandDocuments;

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(`The request to fetch all bot commands timed out: ${error}.`);
      throw new Error(`The request to fetch all bot commands timed out. Please try again later: ${error}.`);
    } else {
      console.error(`There was an error when attempting to get all bot commands: ${error}`);
      throw new Error(`There was an error when attempting to get all bot commands: ${error}`);
    }
  }
}

export const getAllBotLogFiles = async (containerName: string) => {
  try {
    const allBotLogFiles = await instance.get("bot/getlogs", {
      params: {
        containerName: containerName
      }
    });

    return allBotLogFiles;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(`The request to fetch all bot log files timed out: ${error}.`);
      throw new Error(`The request to fetch all bot log files timed out. Please try again later: ${error}.`);
    } else {
      console.error(`There was an error when attempting to get all bot log files: ${error}`);
      throw new Error(`There was an error when attempting to get all bot log files: ${error}`);
    }
  }
}

export const writeBotLogFile = async (logName: string, fileContents: string, containerName: string) => {
  const requestObject = {
    logFileName: logName,
    containerName: containerName,
    fileContents: fileContents
  }

  try {
    const writeBotLogFile = await instance.put("bot/writelog", requestObject);

    return writeBotLogFile;
  } catch (error) {
    console.error(`There was an error when attempting to write a log file to the specified container: ${error}`);
    throw new Error(`There was an error when attempting to write a log file to the specified container: ${error}`);
  }
}

export const writeBotCommandFile = async (commandFileName: string, commandFileData: Object, containerName: string) => {
  const requestObject = {
    commandFileName: commandFileName,
    commandFileData: commandFileData,
    containerName: containerName
  }

  try {
    const writeBotCommandFile = await instance.put("bot/writecommand", requestObject);

    return writeBotCommandFile;
  } catch (error) {
    console.error(`There were an error when attempting to write a command file to the specified container: ${error}`);
    throw new Error(`There was an error when attempting to write a command file to the specified container: ${error}`);
  }
}