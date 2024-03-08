import { instance } from "../index.ts";

type BotConfiguration = {
  guildId: string;
  commandChannelId: string;
  buttonChannelId: string;
  botInfoChannelId: string;
  botErrorChannelId: string;
};

export const postBotConfigurations = async (
  botConfiguration: BotConfiguration
) => {
  try {
    console.log(instance);
    const response = await instance.post("bot/configs", botConfiguration);

    return response;
  } catch (error: unknown) {
    throw new Error(`Post bot configuration Error : ${error} `);
  }
};
