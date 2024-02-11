/*
Imports from Node.js and other libraries defined in package.json
*/
import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../.env'});
import createError from 'http-errors';
import express, { NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import { Collection, GatewayIntentBits, Guild, GuildMemberRoleManager, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js';
/*
Imports from Custom classes
*/
import indexRouter from './api/routes/index.js';
import userRouter from './api/routes/user.js';
import CustomDiscordClient from './utils/CustomDiscordClient.js';
import CustomEventEmitter from './utils/CustomEventEmitter.js';
import { EmbedBuilder } from '@discordjs/builders';
import CommonClassWorkRepository from './database/CommonClassWorkRepository.js';
import CommonClass from './entity/CommonClass.js';
import { formatDatetimeValue, formatTimeValue } from './utils/NormalizeDatetimeAndTimeValue.js';
import IDatabaseResponseObject from './utils/IDiscordDatabaseResponse.js';
import IDiscordEventData from './utils/IDiscordEventData.js';
import DiscordEvent from './utils/DiscordEvent.js';
import Logger from './utils/Logger.js';
const logger: Logger = new Logger(process.env.discord_bot_messages_logs_file_path, process.env.discord_bot_error_logs_file_path);
const server_port: string | undefined = process.env.port;
const common_class_work_repository: CommonClassWorkRepository = new CommonClassWorkRepository();
const discord_client_instance: CustomDiscordClient = new CustomDiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  discord_commands: Collection<any, any>
});
/*
Variables defined in the application .env file
*/
const discord_bot_token: string | undefined = process.env.discord_bot_token;
const discord_guild_id: string | undefined = process.env.discord_bot_guild_id;

/*
The string 'commands_folder_path' holds the directory path to the 'dist/commands' directory, which contains all of the '.js' command files, excluding the script used
to deploy the commands to the discord bot. Occasionally, TypeScript may generate scripts that end with a .map extension. We must ignore those because they are not
command files. 
*/
const commands_folder_path: string = path.join(__dirname, './commands');
const filtered_commands_files: string[] = fs.readdirSync(commands_folder_path).filter(file => file !== 'deploy-commands.js' && !file.endsWith(".map"));
discord_client_instance.discord_commands = new Collection();

/*
Get the singleton instance of the custom event emitter class. The event emitter must be a singleton because only one event emitter can exist in Node.js to prevent any problems.
*/
const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();

/**
 * Dynamically load all of the command files into a collection that will be later passed into the discord bot. Because the variable 'command' holds the imported module,
 * the default exported function is stored in 'command_object', via the .default() operator and then stored in the discord bot commands collection. By setting the collection key
 * to be the name of the command, and the value to be the command data, each command name executed in discord will be associated with some command data. 
 */
async function fetchCommandFiles() {
  for (const command_file of filtered_commands_files) {
    const command_file_path = path.join(commands_folder_path, command_file);
    const command = await import(command_file_path);
    const command_object = command.default();
    discord_client_instance.discord_commands.set(command_object.data.name, command_object);
  }
}

/**
 * Discord bots throw events when some operation occurs. In this instance, the Discord API throws the 'ready' event via the bot because the bot is ready to be used and is 
 * connected to the Discord channel. 
 */
discord_client_instance.on('ready', async () => {
  fetchCommandFiles();
  if (discord_client_instance.user) {
    console.log(`The discord bot is logged in as ${discord_client_instance.user.tag}`);
  } else {
    console.log(`The discord bot has not logged in`);
  }
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
discord_client_instance.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) {
    return;
  }

  /*
  The command variable stores the command object value stored in the discord bot collection. For example, if you request the '/help' command, the command variable will be 
  filled with the object data from the /help command. 
  */
  const command = discord_client_instance.discord_commands.get(interaction.commandName);

  if (!command) {
    interaction.reply({content:'The command you have attempted to use does not exist. Please try again or use another command that is registered with the bot', ephemeral: true},);
    return;
  }

  /*
  The if statement checks for the following 3 conditions:
  1. The command that is executed contains an authorization_role_name property
  2. The Discord player who called the command has a role that is associated with the Discord server
  3. The Discord player who called the command has the exact same role as defined in the command file property 'authorization_role_name'. 
  */
  if (command.authorization_role_name != undefined && interaction.member?.roles instanceof GuildMemberRoleManager 
    && interaction.member.roles.cache.some(role => command.authorization_role_name.includes(role.name))) {
      /*
      Given the interaction that the user just had with the bot, we will call the asynchronous 'execute' function that is in the command file. This will trigger the Discord
      bot to respond to the user with a proper acknowledgement response, given that no errors occur.
      */
      try {
        logger.logMessage(`The bot command ${interaction.commandName} was used\n`);
        await command.execute(interaction);
      } catch (error) {
        logger.logError(`An error occured while attempting to execute the bot command ${interaction.commandName}: ${error}\n`)
        await interaction.reply({content: `There was an error when attempting to execute the command. Please inform the bot developer of this error ${error}`,ephemeral:true});
        console.error(error);
      }
  } else {
    await interaction.reply({content: `You do not have permission to execute the command ${command.data.name}. Please contact your bot administrator if this is an error`,ephemeral:true});
  }
});

discord_client_instance.login(discord_bot_token);

custom_event_emitter.on('databaseOperationEvent', 
  /**
   * An asynchronous arrow function that uses the Discord API EmbedBuilder to create nicely-formatted messages to send to a specific channel in Discord whenever the
   * database on Microsoft Azure is used. Tshe Discord API recognizes channels by using an integer id, so we will use an integer from the .env file. 
   * 
   * @param message an instance of IDatabaseResponseObject
   */
  async(message: IDatabaseResponseObject) => {
    const database_operation_embedded_message = new EmbedBuilder()
      .setColor(0x299bcc)
      .setTitle('Database operation on Azure MySQL database')
      .setThumbnail('https://i.imgur.com/9rn0xvQ.jpeg')
      .setDescription(`Database operation response status: ${message.status}`)
      .addFields(
        { name: 'Database response status:', value: message.statusText, inline:true}
      )
      .setTimestamp()
      .setFooter({text:'Azure database operation', iconURL: 'https://i.imgur.com/9rn0xvQ.jpeg'}
    );

    const discord_channel_for_operation_results = process.env.discord_bot_http_response_channel_id;
    
    if (!discord_channel_for_operation_results) {
      throw new Error(`The discord channel id for database operation results could not be fetched.`);
    }

    /*
    The Discord bot instance caches the discord channel, so we have to fetch the cached channel given the channel id
    */
    const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_operation_results);

    /*
    We must use the 'embeds' option and pass in the EmbedBuilder as parameter data 
    */
    if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
      discord_channel_for_messages.send({embeds: [database_operation_embedded_message]});
    }
});

custom_event_emitter.on('showClassesInSchedule', 
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
  async(classes: CommonClass[]) => {
    const discord_channel_for_class_data_results = process.env.discord_bot_command_channel_id;
    if (!discord_channel_for_class_data_results) {
        throw new Error(`The discord channel id for database operation results could not be fetched.`);
    }

    const class_work_hash_map = new Map();

    /*
    Collect all of the CommonClassWork objects into a hash map for easy access when we need to add the properties of the object into the original embedded message
    */
    for (const common_class of classes) {
      const common_class_info = common_class.commonClassInformation();
      const class_work_array = await common_class_work_repository.findByClassId(common_class_info.class_id);
      class_work_hash_map.set(common_class_info.class_id, class_work_array);
    }

    const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_class_data_results);

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
              { name: `Course start time:`, value: formatTimeValue(common_class_info.class_start_time) },
              { name: `Course end time:`, value: formatTimeValue(common_class_info.class_end_time) },
              { name: `\u200B`, value: `\u200B`},
          )
          .setThumbnail('https://i.imgur.com/9rn0xvQ.jpeg')
          .setTimestamp()
          .setFooter({ text: common_class_info.class_name, iconURL: 'https://i.imgur.com/9rn0xvQ.jpeg' });

      /*
      forEach iterator is used to add additional fields to the EmbedBuilder before passing the embedded message to the Discord API for use there. 
      */
      const class_work_array = class_work_hash_map.get(common_class_info.class_id);
      if (class_work_array) {
        class_work_array.forEach((class_work_document: { homework_due_date: string; homework_name: any; }) => {
              const class_work_document_due_date: string = formatDatetimeValue(class_work_document.homework_due_date);
              class_in_schedule_embedded_message.addFields(
                  { name: `${class_work_document.homework_name}`, value: `Due on ${class_work_document_due_date}`, inline: true }
              );
          });
      }

      /*
      Must pass the message as a parameter value for the 'embeds' property, to indicate the message is an instance of EmbedBuilder
      */
      if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
          discord_channel_for_messages.send({ embeds: [class_in_schedule_embedded_message] });
      }
    }
});

custom_event_emitter.on('createDiscordGuildEvent', 
    /**
   * An asynchronous arrow function that uses the Discord API to create Guild (server) events. The Discord API recognizes channels by using an integer id, 
   * so we will use an integer from the .env file. The Discord API does not let you create Guild events if the event start or end time is in the past, so we must 
   * get the current day and time and construct a new Date object of the current time, so the event can be created and not be considered 'in the past'. 
   * 
   * @param message CommonClass[] an array of CommonClass objects
   */
  async(classes: CommonClass[], day_of_the_week: string) => {
    const guild_id: string | undefined = process.env.discord_bot_guild_id;
    let guild: Guild | undefined;

    /*
    Fetch the Discord server to schedule the event in if the Discord server id exists and is valid
    */
    if (guild_id !== undefined) {
      guild = discord_client_instance.guilds.cache.get(guild_id);
    }

    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth();
    const date: number = today.getDate();

    if (guild !== undefined) {
      const discordEventClassInstance = new DiscordEvent(guild);
      /*
      For each CommonClass object in the classes array, create a scheduled Discord event that is populated with the relevant CommonClass data.
      */
      for (const common_class of classes) {
        const common_class_info = common_class.commonClassInformation();
        const [start_hours, start_minutes] = common_class_info.class_start_time.split(':').map(Number);
        const [end_hours, end_minutes] = common_class_info.class_end_time.split(':').map(Number);
        const scheduled_start_date = new Date(year, month, date, start_hours, start_minutes);
        const scheduled_end_date = new Date(year, month, date, end_hours, end_minutes);
        const discord_event_data_class_name = common_class_info.class_name;
        const discord_event_data_class_code = common_class_info.class_course_code;
        
        const discord_event_data: IDiscordEventData =  {
          discord_event_data_class_name,
          scheduled_start_date,
          scheduled_end_date,
          discord_event_data_class_code,
          entityType: GuildScheduledEventEntityType.External,
          privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
          entityMetadata: {
            location: "In person"
          }
        }

        discordEventClassInstance.createNewDiscordEvent(discord_event_data);
      }
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use("/", indexRouter);
app.use("/user", userRouter);

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
  console.log(`The Node server is running on port ${server_port}}`);
})

export default app;