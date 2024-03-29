import { instance } from "../index.ts";
import { Bot, BotCommand } from "../../pages/types/BotTypes.ts";
import { UserInfo } from "../../pages/types/UserTypes.ts";
import { UUID } from "crypto";

export const postBotCommands = async (botCommand: BotCommand) => {
  try {
    const postBotCommandsResponse = await instance.post(
      "bot/commands",
      botCommand
    );

    return postBotCommandsResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to post the bot command options to the MongoDB database: ${error}`
    );
    throw new Error(
      `There was an error when attempting to post the bot command options to the MongoDB database: ${error}`
    );
  }
};

export const postBotRegister = async (bot: Bot) => {
  try {
    const postBotResponse = await instance.post("bot/create", bot);

    return postBotResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to post the bot data to the MongoDB database: ${error}`
    );
    throw new Error(
      `There was an error when attempting to post the bot data to the MongoDB database: ${error}`
    );
  }
};

export const postBotRequestCommand = async (botCommand: BotCommand) => {
  try {
    const postBotRequestCommandResponse = await instance.post(
      "bot/newcommandrequest",
      botCommand
    );

    return postBotRequestCommandResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to send an email to the server administrator requesting an email: ${error}`
    );
    throw new Error(
      `There was an error when attempting to send an email to the server administrator requesting an email: ${error}`
    );
  }
};

export const postChangeUserOptions = async (userOptions: UserInfo) => {
  try {
    const postBotRequestCommandResponse = await instance.post(
      "user/changeuserdata",
      userOptions
    );

    return postBotRequestCommandResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to change the user profile data: ${error}`
    );
    throw new Error(
      `There was an error when attempting to change the user profile data: ${error}`
    );
  }
};

export const getBot = async (botEmail: string) => {
  try {
    const headers = {
      "bot-email": botEmail,
    };
    const allBotCommandDocuments = await instance.get("bot/getbot", {
      headers: headers,
    });

    return allBotCommandDocuments;
  } catch (error) {
    console.error(`The request to fetch the bot timed out: ${error}.`);
    throw new Error(
      `The request to fetch the bot timed out. Please try again later: ${error}.`
    );
  }
};

export const getAllBotCommands = async () => {
  try {
    const allBotCommandDocuments = await instance.get("bot/getcommands");

    return allBotCommandDocuments;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error(
        `The request to fetch all bot commands timed out: ${error}.`
      );
      throw new Error(
        `The request to fetch all bot commands timed out. Please try again later: ${error}.`
      );
    } else {
      console.error(
        `There was an error when attempting to get all bot commands: ${error}`
      );
      throw new Error(
        `There was an error when attempting to get all bot commands: ${error}`
      );
    }
  }
};

export const updateBotId = async (bot_id: UUID) => {
  try {
    const updateBotIdResponse = await instance.patch("bot/updatebotid", {
      bot_id,
    });

    return updateBotIdResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to update the bot id: ${error}`
    );
    throw new Error(
      `There was an error when attempting to update the bot id: ${error}`
    );
  }
};

export const updateBotLoggingChannels = async (bot_channels_ids: any) => {
  try {
    const updateBotChannelsResponse = await instance.patch(
      "bot/updatechannelids",
      bot_channels_ids
    );

    return updateBotChannelsResponse;
  } catch (error) {
    console.error(
      `There was an error when attempting to update the bot logging channel ids: ${error}`
    );
    throw new Error(
      `There was an error when attempting to update the bot logging channel ids: ${error}`
    );
  }
};

export const getAllBotLogFiles = async (containerName: string) => {
  try {
    const allBotLogFiles = await instance.get("bot/getlogs", {
      params: {
        containerName: containerName,
      },
    });

    return allBotLogFiles;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error(
        `The request to fetch all bot log files timed out: ${error}.`
      );
      throw new Error(
        `The request to fetch all bot log files timed out. Please try again later: ${error}.`
      );
    } else {
      console.error(
        `There was an error when attempting to get all bot log files: ${error}`
      );
      throw new Error(
        `There was an error when attempting to get all bot log files: ${error}`
      );
    }
  }
};

export const writeBotLogFile = async (
  logName: string,
  fileContents: string,
  containerName: string
) => {
  const requestObject = {
    logFileName: logName,
    containerName: containerName,
    fileContents: fileContents,
  };

  try {
    const writeBotLogFile = await instance.put("bot/writelog", requestObject);

    return writeBotLogFile;
  } catch (error) {
    console.error(
      `There was an error when attempting to write a log file to the specified container: ${error}`
    );
    throw new Error(
      `There was an error when attempting to write a log file to the specified container: ${error}`
    );
  }
};

export const writeBotCommandFile = async (
  commandFileName: string,
  commandFileData: object,
  containerName: string
) => {
  const requestObject = {
    commandFileName: commandFileName,
    commandFileData: commandFileData,
    containerName: containerName,
  };

  try {
    const writeBotCommandFile = await instance.put(
      "bot/writecommand",
      requestObject
    );

    return writeBotCommandFile;
  } catch (error) {
    console.error(
      `There were an error when attempting to write a command file to the specified container: ${error}`
    );
    throw new Error(
      `There was an error when attempting to write a command file to the specified container: ${error}`
    );
  }
};
