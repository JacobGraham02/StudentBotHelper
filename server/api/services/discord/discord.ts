import * as dotenv from "dotenv";
import { instanceDiscordAPI } from "../index";

import { ApplicationConfigs, ApplicationCommandParams } from "./interfaces";

// Get the bot's (Application Configurations)
const getApplicationConfigs = async () => {
  try {
    const applicationResponse = await instanceDiscordAPI.get(
      "/applications/@me"
    );

    return applicationResponse.data;
  } catch (error) {
    console.error("Error pulling Application Configurations." + error);
  }
};

// Update the bot's (Application Configurations)
const updateApplicationConfig = async (data: ApplicationConfigs) => {
  try {
    const applicationResponse = await instanceDiscordAPI.patch(
      "/applications/@me",
      data
    );

    return applicationResponse.data;
  } catch (error) {
    console.error("Error pulling Application Configurations." + error);
  }
};

// Get the Guild Application Commands
const getGuildApplicationCommands = async (applicationId: string) => {
  try {
    // Assuming we will hard code the guild Id (server)... Making this dynamic for dealing with other guilds(Servers)
    const guildId = process.env.discord_bot_guild_id;
    const applicationCommands = await instanceDiscordAPI.get(
      `applications/${applicationId}/guilds/${guildId}/commands`
    );

    return applicationCommands.data;
  } catch (error) {
    console.error("Error pulling Guild Application Commands." + error);
  }
};

// Resources:
// https://autocode.com/guides/how-to-build-a-discord-bot/
// Create a Guild Application Command
const createGuildApplicationCommands = async (
  applicationId: string,
  data: ApplicationCommandParams
) => {
  try {
    const guildId = process.env.discord_bot_guild_id;
    const response = await instanceDiscordAPI.post(
      `applications/${applicationId}/guilds/${guildId}/commands`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error creating Guild Application Command " + error);
  }
};

// Update a Guild Application Command
const updateGuildApplicationCommands = async (
  applicationId: string,
  commandId: string,
  data: ApplicationCommandParams
) => {
  try {
    const guildId = process.env.discord_bot_guild_id;
    const response = await instanceDiscordAPI.patch(
      `applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Guild Application Command " + error);
  }
};

// Delete a Guild Application Command
const deleteGuildApplicationCommands = async (
  applicationId: string,
  commandId: string
) => {
  try {
    const guildId = process.env.discord_bot_guild_id;
    const response = await instanceDiscordAPI.delete(
      `applications/${applicationId}/guilds/${guildId}/commands/${commandId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Guild Application Command " + error);
  }
};
