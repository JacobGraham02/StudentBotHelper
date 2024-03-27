/*
Imports from Node.js and other libraries defined in package.json
*/
import * as dotenv from "dotenv";
dotenv.config();
import createError from "http-errors";
import express, { NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import {
  Channel,
  Collection,
  Events,
  GatewayIntentBits,
  Guild,
  GuildMemberRoleManager,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  REST,
  Routes} from "discord.js";
/*
Imports from Custom classes
*/
import indexRouter from "./api/routes/botapi";
import userRouter from "./api/routes/user";
import apiRouter from "./api/routes/botapi";
import CustomDiscordClient from "./utils/CustomDiscordClient";
import CustomEventEmitter from "./utils/CustomEventEmitter";
import {EmbedBuilder} from "@discordjs/builders";
import CommonClassWorkRepository from "./database/MySQL/CommonClassWorkRepository";
import CommonClass from "./entity/CommonClass";
import {
  formatDatetimeValue,
  formatTimeValue,
} from "./utils/NormalizeDatetimeAndTimeValue";
import IDiscordEventData from "./utils/IDiscordEventData";
import DiscordEvent from "./utils/DiscordEvent";
const server_port: string | undefined = process.env.port;
import handleButtonInteraction from "./modules/handleButtonInteraction";
import CommonClassWork from "./entity/CommonClassWork";
import Logger from "./utils/Logger";
import BotController from "./api/controllers/BotController";
import BotRepository from "./database/MongoDB/BotRepository";
import { DiscordBotInformationType } from "./database/MongoDB/types/DiscordBotInformationType";
import { hashPassword } from "./modules/hashAndValidatePassword";
const common_class_work_repository: CommonClassWorkRepository =
  new CommonClassWorkRepository();
const bot_repository = new BotRepository();
const discord_client_instance: CustomDiscordClient = new CustomDiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  discord_commands: Collection<any, any>,
});
let logger: Logger;
let channelForCommands: Channel | undefined = undefined;
let channelToSendLogs: Channel | undefined = undefined;
let channelToSendErrors: Channel | undefined = undefined;
let guild_id: string | undefined = undefined;
let botGuild: Guild | undefined = undefined;
let bot_id: string | undefined = undefined;
/*
Variables defined in the application .env file
*/
const discord_bot_token: string | undefined = process.env.discord_bot_token;
const discord_guild_id: string | undefined = process.env.discord_bot_guild_id;
const discord_token = process.env.discord_bot_token;

const registerInitialSetupCommands = async (botId: string, guildId: string) => {
  const commands_folder_path: string = path.join(__dirname, "../dist/commands");
  const filtered_commands_files: string[] = fs
    .readdirSync(commands_folder_path)
    .filter((file) => file !== "deploy-commands.ts" && !file.endsWith(".map"));
  discord_client_instance.discord_commands = new Collection();

  const commands: any[] = [];

  const initialBotCommandNames = [`setupuser`, `setupchannels`, `registercommands`];

  for (const command_file of filtered_commands_files) {
    const command_file_path = path.join(commands_folder_path, command_file);
    const command = await import(command_file_path);
    const command_object = command.default();

    discord_client_instance.discord_commands.set(command_object.data.name, command_object);

    // Check if the bot ID array in the command matches the target bot ID
    if (initialBotCommandNames.includes(command_object.data.name)) {
      commands.push(command_object.data);
    }
  }

  if (discord_token && botId && guildId) {
    const rest = new REST({ version: '10' }).setToken(discord_token);

    rest.put(Routes.applicationGuildCommands(botId, guildId), {
      body: commands
    }).then(() => {
      if (channelToSendLogs) {
        logger.logDiscordMessage(
          channelToSendLogs,
          `The initial application setup commands were successfully registered for the guild ${guildId}`
        )
      }
      writeLogToAzureStorage(
        `The initial application setup commands were successfully registered for the guild ${guildId}`,
        `MessageLog`,
        `studentbothelperinfo`
      )
      console.log('The initial application setup commands were successfully registered');
    }).catch((error) => {
      console.error(`The application encountered an error when registering the commands with the discord bot. All environment variables were valid. ${error}`);
      if (channelToSendErrors) {
        logger.logDiscordMessage(
          channelToSendErrors,
          `The initial application setup commands were successfully registered for the guild ${guildId}`
        )
      }
      writeLogToAzureStorage(
        `The initial application setup commands were successfully registered for the guild ${guildId}`,
        `MessageLog`,
        `studentbothelperinfo`
      )
    });
  } else {
    if (channelToSendErrors) {
      logger.logDiscordMessage(
        channelToSendErrors,
        `The discord bot credentials was invalid when trying to register commands with the bot in guild ${guildId}`
      )
    }
    writeLogToAzureStorage(
      `The discord bot credentials was invalid when trying to register commands with the bot in guild ${guildId}`,
      `MessageLog`,
      `studentbothelperinfo`
    )
    console.error(`The discord client id, guild id, or bot token was invalid when trying to register commands with the bot`);
  }
}

/*
Get the singleton instance of the custom event emitter class. The event emitter must be a singleton because only one event emitter can exist in Node.js to prevent any problems.
*/
const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();

async function writeLogToAzureStorage(fileContents: string, fileName: string, containerName: string): Promise<void> {
  try {
      await bot_repository.writeLogToAzureContainer(fileContents, fileName, containerName);
  } catch (error) {
      console.error(`Error writing command file '${fileName}' to the container '${containerName}': ${error}`);
      throw new Error(`Error writing command file '${fileName}' to the container '${containerName}': ${error}`);
  }
}

/**
 * Discord bots throw events when some operation occurs. In this instance, the Discord API throws the 'ready' event via the bot because the bot is ready to be used and is
 * connected to the Discord channel.
 */
// async function writeLogToAzureStorage(fileContents: string, fileName: string, containerName: string): Promise<void> {
discord_client_instance.on("ready", async () => {
  if (discord_client_instance.user) {
    console.log(
      `The discord bot is logged in as ${discord_client_instance.user.tag}`
    );
    writeLogToAzureStorage(
      `The Discord bot is logged in as: ${discord_client_instance.user.tag}`, 
      `MessageLog`, 
      `studentbothelperinfo`
    );
  } else {
    console.log(`The discord bot has not logged in`);
  }
  writeLogToAzureStorage(
    `The Discord bot is logged in as: ${discord_client_instance.user!.tag}`, 
    `ErrorLog`, 
    `studentbothelpererror`
  );
  console.log(`The bot is logged in as ${discord_client_instance.user!.tag}`);

  if (!discord_guild_id) {
    return;
  }
});

/**
 * Discord bots throw events when some operation occurs. In this instance, the Discord API throws the event 'interactionCreate' when a user interacts with the bot. In this scenario,
 * an interaction is defined as anything that a user does when interacting with the bot.
 * An interaction in Discord contains information such as the following:
 *  1. The Discord guild (server) information that the interaction occurred on
 *  2. The Discord user that caused the interaction
 *  3. The channel that the interaction occurred on
 *
 */
discord_client_instance.on("interactionCreate", async (interaction) => {
  
  if (interaction.isButton()) {
    await handleButtonInteraction(interaction);
  }

  if (!interaction.isCommand()) {
    return;
  }
  
  /*
  The command variable stores the command object value stored in the discord bot collection. For example, if you request the '/help' command, the command variable will be 
  filled with the object data from the /help command. 
  */
  const command = discord_client_instance.discord_commands.get(
    interaction.commandName
  );

  if (!command) {
    interaction.reply({
      content:
        "The command you have attempted to use does not exist. Please try again or use another command that is registered with the bot",
      ephemeral: true,
    });
    writeLogToAzureStorage(
      `The user ${interaction.user.username} attempted to use a command that does not exist: ${interaction.commandName}`, 
      `MessageLog`, 
      `studentbothelperinfo`
      );
    return;
  }

  if (interaction.commandName === `registercommands`) {
    if (!discord_client_instance) {
      console.log(`The discord_client_instance is undefined`);
      return;
    }

    const registerCommandResult = await command.execute(interaction);

    if (registerCommandResult && registerCommandResult.discord_client_instance_collection) {
      discord_client_instance.discord_commands = registerCommandResult.discord_client_instance_collection;
    }
  }
  
  /*
  The if statement checks for the following 3 conditions:
  1. The command that is executed contains an authorization_role_name property
  2. The Discord player who called the command has a role that is associated with the Discord server
  3. The Discord player who called the command has the exact same role as defined in the command file property 'authorization_role_name'. 
  */
  if (
    command.authorization_role_name != undefined &&
    interaction.member?.roles instanceof GuildMemberRoleManager &&
    interaction.member.roles.cache.some((role) =>
      command.authorization_role_name.includes(role.name)
    )
  ) {
    /*
      Given the interaction that the user just had with the bot, we will call the asynchronous 'execute' function that is in the command file. This will trigger the Discord
      bot to respond to the user with a proper acknowledgement response, given that no errors occur.
      */

    logger = new Logger(discord_client_instance);

    try {
      const botInfo = await bot_repository.findBotByGuildId(interaction.guildId!);

      if (botInfo && interaction.channel && botInfo.bot_commands_channel) {
        
        if (interaction.channel.id !== botInfo.bot_commands_channel) {
          writeLogToAzureStorage(
            `The user ${interaction.user.username} attempted to use a command in the wrong channel`,
            `ErrorLog`,
            `studentbothelpererror`
          )
          if (channelToSendErrors) {
            logger.logDiscordError(
              channelToSendErrors,
              `An error occured while the user ${interaction.user.displayName} (${interaction.user.id}) attempted to execute the bot command **${interaction.commandName}**: in the wrong channel`
            );
          }
          await interaction.reply({content:`You have used a command in the wrong channel! Use the channel titled **bot-commands-channel** instead to use commands`});
          return;
        }
      }

      await command.execute(interaction);

      if (!botInfo) {
        return;
      }

      if (!botInfo) {
        writeLogToAzureStorage(
          `The Discord bot is logged in as: ${discord_client_instance.user!.tag}`, 
          `ErrorLog`, 
          `studentbothelpererror`
          );
        throw new Error(`Bot information not found for this guild`);
      }

      if (botInfo) {
        const channelIdForCommands = botInfo.bot_commands_channel;
        const channdlIdForLogs = botInfo.bot_command_usage_information_channel;
        const channelIdForErrors = botInfo.bot_command_usage_error_channel;
        bot_id = botInfo.bit_id;
        guild_id = botInfo.bot_guild_id;

        channelForCommands = interaction.client.channels.cache.get(channelIdForCommands);
        channelToSendLogs = interaction.client.channels.cache.get(channdlIdForLogs);
        channelToSendErrors = interaction.client.channels.cache.get(channelIdForErrors);
      }

      if (guild_id) {
        botGuild = interaction.client.guilds.cache.get(guild_id);
      }

      if (channelToSendLogs) {
        logger.logDiscordMessage(
          channelToSendLogs,
          `The bot command **${interaction.commandName}** was used by the user ${interaction.user.displayName} (${interaction.user.id})\n`
        );
      }
      writeLogToAzureStorage(`The bot command ${interaction.commandName} was used by the user ${interaction.user.displayName} (${interaction.user.id})`, `MessageLog`, `studentbothelperinfo`);
    } catch (error) {
      if (channelToSendLogs) {
        logger.logDiscordError(
          channelToSendErrors,
          `An error occured while the user ${interaction.user.displayName} (${interaction.user.id}) attempted to execute the bot command **${interaction.commandName}**: ${error}\n`
        );
      }
      writeLogToAzureStorage(
      `An error occured while the user ${interaction.user.displayName} (${interaction.user.id}) attempted to execute the bot command **${interaction.commandName}**: ${error}`, 
      `ErrorLog`, 
      `studentbothelpererror`
      );
      await interaction.editReply({
        content: `There was an error when attempting to execute the command. Please inform the server administrator of this error ${error}`,
      });
      writeLogToAzureStorage(
        `There was an error when attempting to execute the command. Please inform the server administrator of this error ${error}`,
        `ErrorLog`,
        `studentbothelpererror`
      );
      throw new Error(`There was an error when attempting to execute this command: ${error}`);
    }
  } else {
    await interaction.reply({
      content: `You do not have permission to execute the command ${command.data.name}. Please inform the server administrator if you believe this is an error`,
      ephemeral: true,
    });
    if (channelToSendErrors) {
      logger.logDiscordError(
        channelToSendErrors,
        `The user ${interaction.user.displayName} (${interaction.user.id}) did not have permission to execute the command **${command.data.name}**`
      );
    }
    writeLogToAzureStorage(
      `The user ${interaction.user.displayName} (${interaction.user.id}) did not have permission to execute the command ${command.data.name}`,
      `ErrorLog`,
      `studentbothelpererror`
    )
  }
});

discord_client_instance.login(discord_bot_token);

discord_client_instance.on('guildCreate', async (guild) => {
  const botInfo = await bot_repository.findBotByGuildId(guild.id);

  if (botInfo) {
    const channelIdForCommands = botInfo.bot_commands_channel;
    const channdlIdForLogs = botInfo.bot_command_usage_information_channel;
    const channelIdForErrors = botInfo.bot_command_usage_error_channel;
    channelForCommands = guild.channels.cache.get(channelIdForCommands)
    channelToSendLogs = guild.channels.cache.get(channdlIdForLogs);
    channelToSendErrors = guild.channels.cache.get(channelIdForErrors);
  }

  bot_id = discord_client_instance.user?.id;
  guild_id = guild.id;
  botGuild = guild;
  await registerInitialSetupCommands(bot_id!, guild_id);
});

discord_client_instance.on(Events.InteractionCreate, async interaction => {
  if (interaction.isModalSubmit()) {

    if (interaction.customId === 'userDataInputModal') {
        const student_username = interaction.fields.getTextInputValue('usernameInput');
        const student_email = interaction.fields.getTextInputValue('emailInput');
        const student_password = interaction.fields.getTextInputValue('passwordInput');
        const bot_id = interaction.fields.getTextInputValue('botIdInput');
        const student_for_database_password_object = hashPassword(student_password);
        const guild_id = interaction.guildId;

      const createBotObject: DiscordBotInformationType = {
        bot_guild_id: guild_id!,
        bot_id: bot_id,
        bot_username: student_username,
        bot_password: student_for_database_password_object.hash,
        bot_email: student_email
      }

      try {
        await bot_repository.createBot(createBotObject);
        writeLogToAzureStorage(
          `A user data input modal has been submitted`,
          `MessageLog`,
          `studentbothelperinfo`
        )
      } catch (error) {
        console.error(`There was an error when attempting to insert user data modal inputs into the database: ${error}`);
        writeLogToAzureStorage(
          `There was an error when attempting to insert user data modal inputs into the database`,
          `ErrorLog`,
          `studentbothelpererror`
        )
        throw new Error(`There was an error when creating a new bot document in the database: ${error}`);
      }

    } else if (interaction.customId === `channelIdInputModal`) {

      const commandChannelId = interaction.fields.getTextInputValue(`commandChannelIdInput`);
      const informationChannelId = interaction.fields.getTextInputValue(`informationChannelIdInput`);
      const errorChannelId = interaction.fields.getTextInputValue(`errorChannelIdInput`);
      const botRoleButtonChannelId = interaction.fields.getTextInputValue(`roleButtonChannelIdInput`);
      const botId = interaction.fields.getTextInputValue(`botIdInput`);

      const updateBotChannelIdsObject: DiscordBotInformationType = {
        bot_id: botId,
        bot_role_button_channel_id: botRoleButtonChannelId,
        bot_commands_channel_id: commandChannelId,
        bot_command_usage_information_channel_id: informationChannelId,
        bot_command_usage_error_channel_id: errorChannelId
      }

      try {
        await bot_repository.updateBotChannelIds(updateBotChannelIdsObject);
        writeLogToAzureStorage(
          `A user channel ids input modal has been submitted`,
          `MessageLog`,
          `studentbothelperinfo`
        )
      } catch (error) {
        console.error(`There was an error when attempting to insert user channel id inputs into the database: ${error}`);
        writeLogToAzureStorage(
          `There was an error when attempting to insert user data modal inputs into the database`,
          `ErrorLog`,
          `studentbothelpererror`
        )
        throw new Error(`There was an error when updating the bot document in the database: ${error}`);
      }
    }

    if (interaction.customId === `channelIdInputModal`) {
      await interaction.reply({content: `Your submission for user data was received successfully`, ephemeral: true});
    } else if (interaction.customId === `userDataInputModal`) {
      await interaction.reply({content: `Your submission for channel ids was received successfully`, ephemeral: true});
    }
  }
});

custom_event_emitter.on(
  "showClassesInSchedule",
  /**
   * An asynchronous arrow function that uses the Discord API EmbedBuilder to create nicely-formatted messages that indicate the user of what classes there are today
   * and any class work that may have to be completed. For each common class that exists in the database, the common class work database table is queried for any
   * class work that has a class_id which matches the id of the common class. If the ids match, a hash map is then populated with the results from the common class work query.
   * Firstly, each EmbedBuilder is created by iterating over the array of CommonClass objects, as we need to display the class name, course code, start time, and end time. In the
   * EmbedBuilder, the class name is set as the title, and the course code, start time, and end time are set as fields.
   * After the EmbedBuilder is initially populated with the CommonClass object data, the message then has additional fields added onto it which display the name and due date of
   * each CommonClassWork object associated with that CommonClass.
   * @param classes CommonClass[] array of CommonClass objects.
   */
  async (classes: CommonClass[]) => {
    const discord_channel_for_class_data_results = channelForCommands
    if (!discord_channel_for_class_data_results) {
      logger.logDiscordError(
        channelToSendErrors,
        `The discord channel id for showing classes this semester could not be resolved`
      );
      writeLogToAzureStorage(
        `The discord channel id for showing classes this semester could not be resolved`,
        `ErrorLog`,
        `studentbothelpererror`
      )
      throw new Error(
        `The discord channel id for showing classes this semester could not be resolved.`
      );
    }

    const class_work_hash_map = new Map();

    /*
    Collect all of the CommonClassWork objects into a hash map for easy access when we need to add the properties of the object into the original embedded message
    */
    for (const common_class of classes) {
      const common_class_info = common_class.commonClassInformation();
      const class_work_array = await common_class_work_repository.findByClassId(
        common_class_info.class_id
      );
      class_work_hash_map.set(common_class_info.class_id, class_work_array);
    }

    /*
    Iterate over each CommonClass in the classes array and supply the EmbedBuilder with the required parameter data. A custom function is used to normalize the time values
    for the class start and class end time. To prevent Discord from throwing errors such as 'cannot set a start time as in the past', the due date is used (e.g. 7 days from the
    current day) along with the current date and time. If the current day was January 07, 2023 at 12:45, the EmbedBuilder will be supplied with the date January 07, 2023 at 12:45.
    After the initial EmbedBuilder is created, additional fields with CommonClassWork data will be added onto the EmbedBuilder, so users are informed of any class work due dates
    and other relevant information. 
    */
    for (const common_class of classes) {
      const common_class_info = common_class.commonClassInformation();
      const class_in_schedule_embedded_message = new EmbedBuilder()
        .setColor(0x299bcc)
        .setTitle(`${common_class_info.class_name}`)
        .addFields(
          { name: `Course code:`, value: common_class_info.class_course_code },
          {
            name: `Course start time:`,
            value: formatTimeValue(common_class_info.class_start_time),
          },
          {
            name: `Course end time:`,
            value: formatTimeValue(common_class_info.class_end_time),
          },
          { name: `\u200B`, value: `\u200B` }
        )
        .setThumbnail("https://i.imgur.com/WL7Bt6g.png")
        .setTimestamp()
        .setFooter({
          text: common_class_info.class_name,
          iconURL: "https://i.imgur.com/WL7Bt6g.png",
        });

      /*
      forEach iterator is used to add additional fields to the EmbedBuilder before passing the embedded message to the Discord API for use there. 
      */
      const class_work_array: CommonClassWork[] = class_work_hash_map.get(
        common_class_info.class_id
      );
      if (class_work_array) {
        class_work_array.forEach((class_work_document) => {
          const class_work_document_due_date: string = formatDatetimeValue(
            class_work_document.homework_due_date.toString()
          );
          class_in_schedule_embedded_message.addFields(
            {
              name: `${class_work_document.homework_name}`,
              value: `Due on ${class_work_document_due_date}`,
              inline: true,
            },
            {
              name: `Work notes`,
              value: `${class_work_document.homework_notes}`,
              inline: true,
            }
          );
        });
      }

      /*
      Must pass the message as a parameter value for the 'embeds' property, to indicate the message is an instance of EmbedBuilder
      */
      if (
        channelForCommands &&
        channelForCommands.isTextBased()
      ) {
        channelForCommands.send({
          embeds: [class_in_schedule_embedded_message],
        });
      }
    }
  }
);

custom_event_emitter.on(
  "createDiscordGuildEvent",
  /**
   * An asynchronous arrow function that uses the Discord API to create Guild (server) events. The Discord API recognizes channels by using an integer id,
   * so we will use an integer from the .env file. The Discord API does not let you create Guild events if the event start or end time is in the past, so we must
   * get the current day and time and construct a new Date object of the current time, so the event can be created and not be considered 'in the past'.
   *
   * @param message CommonClass[] an array of CommonClass objects
   */
  async (classes: CommonClass[]) => {
    let number_of_events_created = 0;

    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth();
    const date: number = today.getDate();

    if (botGuild) {
      const discordEventClassInstance = new DiscordEvent(botGuild);
      /*
      For each CommonClass object in the classes array, create a scheduled Discord event that is populated with the relevant CommonClass data.
      */
      for (const common_class of classes) {
        const common_class_info = common_class.commonClassInformation();
        const [start_hours, start_minutes] = common_class_info.class_start_time
          .split(":")
          .map(Number);
        const [end_hours, end_minutes] = common_class_info.class_end_time
          .split(":")
          .map(Number);
        const scheduled_start_date = new Date(
          year,
          month,
          date,
          start_hours,
          start_minutes
        );
        const scheduled_end_date = new Date(
          year,
          month,
          date,
          end_hours,
          end_minutes
        );
        const discord_event_data_class_name = common_class_info.class_name;
        const discord_event_data_class_code =
          common_class_info.class_course_code;

        const discord_event_data: IDiscordEventData = {
          discord_event_data_class_name,
          scheduled_start_date,
          scheduled_end_date,
          discord_event_data_class_code,
          entityType: GuildScheduledEventEntityType.External,
          privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
          entityMetadata: {
            location: "Lakehead University, Orillia",
          },
        };
        ++number_of_events_created;
        discordEventClassInstance.createNewDiscordEvent(discord_event_data);
      }
      logger.logDiscordMessage(
        channelToSendLogs,
        `A total of ${number_of_events_created} class events have been created`
      );
      writeLogToAzureStorage(
        `A total of ${number_of_events_created} class events have been created`,
        `ErrorLog`,
        `studentbothelpererror`
      )
    }
  }
);

const app = express();

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.url}`
  );
  next(); // Continue to the next middleware or route handler
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  // credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use("/api/users", userRouter);
app.use("/api/bot", apiRouter);
app.use("/api", indexRouter);

/**
 * Catch any 404 errors and forward them to the error handler
 */
app.use((request: any, response: any, next: NextFunction) => {
  next(createError(404));
});

/**
 * server_port is a variable defined in the .env file, so the type is: string | undefined
 */
app.listen(server_port, function () {
  console.log(`The Node server is running on port ${server_port}`);
});

export default app;
