import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../.env'});
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import { Client, Collection, GatewayIntentBits, GuildMemberRoleManager, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js';
import CustomDiscordClient from './utils/CustomDiscordClient.js';
import CustomEventEmitter from './utils/CustomEventEmitter.js';
import { EmbedBuilder } from '@discordjs/builders';
import DiscordEvent from './utils/DiscordEvent.js';
import IDiscordEventData from './utils/IDiscordEventData.js';
import CommonClassRepository from './database/CommonClassRepository.js';
import schedule from 'node-schedule';
import CommonClass from './entity/CommonClass.js';
const discord_bot_token: string | undefined = process.env.discord_bot_token;
const discord_guild_id: string | undefined = process.env.discord_bot_guild_id;
const common_class_repository: CommonClassRepository = new CommonClassRepository();
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
const commands_folder_path: string = path.join(__dirname, './commands');
const filtered_commands_files = fs.readdirSync(commands_folder_path).filter(file => file !== 'deploy-commands.js' && !file.endsWith(".map"));
discord_client_instance.discord_commands = new Collection();
const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();

async function fetchCommandFiles() {
  for (const command_file of filtered_commands_files) {
    const command_file_path = path.join(commands_folder_path, command_file);
    const command = await import(command_file_path);
    const command_object = command.default();
    discord_client_instance.discord_commands.set(command_object.data.name, command_object);
  }
}
fetchCommandFiles();

discord_client_instance.on('ready', async () => {
  if (discord_client_instance.user) {
    console.log(`The discord bot is logged in as ${discord_client_instance.user.tag}`);
  } else {
    console.log(`The discord bot has not logged in`);
  }
  console.log(`The bot is logged in as ${discord_client_instance.user!.tag}`);

  if (!discord_guild_id) {
    return;
  }
  const node_schedule_event_creation_job = schedule.scheduleJob('0 0 * * *', async function() {
    const guild = await discord_client_instance.guilds.fetch(discord_guild_id);
    const common_class_array: CommonClass[] | undefined = await common_class_repository.findAll();
   
    common_class_array?.forEach((common_class) => {
      const common_class_data = common_class.commonClassInformation();
      const event_data: IDiscordEventData = {
        name: common_class_data.class_name,
        description: `The course ${common_class_data.class_course_code} starts at ${common_class_data.class_start_time} and ends at ${common_class_data.class_end_time}`,
        start_date: common_class_data.class_start_time.toISOString(),
        end_date: common_class_data.class_end_time.toISOString(),
        privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly,
        entity_type: GuildScheduledEventEntityType.External,
        entity_meta_data: {
          location: ''
        }
      }
    });
  });
});

discord_client_instance.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = discord_client_instance.discord_commands.get(interaction.commandName);

  if (!command) {
    interaction.reply({content:'The command you have attempted to use does not exist. Please try again or use another command that is registered with the bot', ephemeral: true},);
    return;
  }
  if (command.authorization_role_name != undefined && interaction.member?.roles instanceof GuildMemberRoleManager 
    && interaction.member.roles.cache.some(role => command.authorization_role_name.includes(role.name))) {
      try {
        await command.execute(interaction);
      } catch (error) {
        await interaction.reply({content: `There was an error when attempting to execute the command. Please inform the bot developer of this error ${error}`,ephemeral:true});
      }
  } else {
    await interaction.reply({content: `You do not have permission to execute the command ${command.data.name}. Please contact your bot administrator if this is an error`,ephemeral:true});
  }
});

discord_client_instance.login(discord_bot_token);

custom_event_emitter.on('databaseOperationEvent', async(message) => {
  const database_operation_embedded_message = new EmbedBuilder()
    .setColor(0x299bcc)
    .setTitle('Database connection operation')
    .setURL('https://discord.js.org/')
    .setDescription(`HTTP response status: ${message.status}`)
    .addFields(
      { name: 'Database response status:', value: message.statusText}
    )
    .setTimestamp()

  const discord_channel_for_operation_results = process.env.discord_bot_http_response_channel_id;
  if (!discord_channel_for_operation_results) {
    throw new Error(`The discord channel id for database operation results could not be fetched.`);
  }
  const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_operation_results);
  if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
    discord_channel_for_messages.send({embeds: [database_operation_embedded_message]});
  }
});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;