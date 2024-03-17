import { SlashCommandBuilder } from "discord.js";
import BotRepository from "../database/MongoDB/BotRepository";

export default function () {
  const change_bot_discord_information_object: Object = {
    data: new SlashCommandBuilder()
      .setName(`change-bot-information`)
      .setDescription(
        `Use this command to change the Discord information that is associated with the bot`
      )
      .addStringOption((options) =>
        options
          .setName(`bot-command-channel-id`)
          .setDescription(`(Optional) command channel id`)
          .setRequired(false)
      )
      .addStringOption((options) =>
        options
          .setName(`bot-database-responses-channel`)
          .setDescription(`(Optional) database responses channel id`)
          .setRequired(false)
      )
      .addStringOption((options) =>
        options
          .setName(`bot-github-responses-channel`)
          .setDescription(`(Optional) github commits responses channel id`)
          .setRequired(false)
      )
      .addStringOption((options) =>
        options
          .setName(`bot-information-messages-channel`)
          .setDescription(
            `(Optional) command usage information messages channel id`
          )
          .setRequired(false)
      )
      .addStringOption((options) =>
        options
          .setName(`bot-information-errors-channel`)
          .setDescription(`(Optional) command usage error message channel id`)
          .setRequired(false)
      ),

    authorization_role_name: ["Discord admin"],

    async execute(interaction) {
      const bot_repository: BotRepository = new BotRepository();
      /*
            Falsy values do not need to be checked for, because the upsert function that is used to update the Discord bot data
            will not replace the existing value in the database with a falsy value. 
            */
      const bot_repository_discord_data: any = {
        bot_commands_channel_id: interaction.options.getString(
          "bot-command-channel-id"
        ),
        bot_command_usage_information_channel_id: interaction.options.getString(
          "bot-information-messages-channel"
        ),
        bot_command_usage_errors_channel_id: interaction.options.getString(
          "bot-information-errors-channel"
        ),
      };

      try {
        await bot_repository.createBot(bot_repository_discord_data);
        await interaction.reply({
          content: `The Discord data in the MongoDB database has been updated`,
          ephemeral: true,
        });
      } catch (error) {
        await interaction.reply({
          content: `There was an error when attempting to insert the updated Discord channel data to the database. Please inform the server administrator of this error: ${error}`,
        });
        throw error;
      }
    },
  };

  return change_bot_discord_information_object;
}
