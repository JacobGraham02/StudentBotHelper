import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../.env'});
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import { Collection, GatewayIntentBits, Guild, GuildMemberRoleManager, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js';
import CustomDiscordClient from './utils/CustomDiscordClient.js';
import CustomEventEmitter from './utils/CustomEventEmitter.js';
import { EmbedBuilder } from '@discordjs/builders';
import CommonClassWorkRepository from './database/CommonClassWorkRepository.js';
import CommonClass from './entity/CommonClass.js';
import { formatDatetimeValue, formatTimeValue } from './utils/NormalizeDatetimeAndTimeValue.js';
const discord_bot_token: string | undefined = process.env.discord_bot_token;
const discord_guild_id: string | undefined = process.env.discord_bot_guild_id;
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
        console.error(error);
      }
  } else {
    await interaction.reply({content: `You do not have permission to execute the command ${command.data.name}. Please contact your bot administrator if this is an error`,ephemeral:true});
  }
});

discord_client_instance.login(discord_bot_token);

custom_event_emitter.on('databaseOperationEvent', async(message) => {
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

  const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_operation_results);

  if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
    discord_channel_for_messages.send({embeds: [database_operation_embedded_message]});
  }
});

custom_event_emitter.on('showClassesInSchedule', async(classes: CommonClass[]) => {
  const discord_channel_for_class_data_results = process.env.discord_bot_command_channel_id;
  if (!discord_channel_for_class_data_results) {
      throw new Error(`The discord channel id for database operation results could not be fetched.`);
  }

  const class_work_hash_map = new Map();

  for (const common_class of classes) {
    const common_class_info = common_class.commonClassInformation();
    const class_work_array = await common_class_work_repository.findByClassId(common_class_info.class_id);
    class_work_hash_map.set(common_class_info.class_id, class_work_array);
  }

  const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_class_data_results);

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


    const class_work_array = class_work_hash_map.get(common_class_info.class_id);
    if (class_work_array) {
      class_work_array.forEach(class_work_document => {
            const class_work_document_due_date: string = formatDatetimeValue(class_work_document.homework_due_date);
            class_in_schedule_embedded_message.addFields(
                { name: `${class_work_document.homework_name}`, value: `Due on ${class_work_document_due_date}`, inline: true }
            );
        });
    }

    if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
        discord_channel_for_messages.send({ embeds: [class_in_schedule_embedded_message] });
    }
  }
});

custom_event_emitter.on('createDiscordGuildEvent', async(classes: CommonClass[], day_of_the_week: string) => {
  const guild_id: string | undefined = process.env.discord_bot_guild_id;
  let guild: Guild | undefined;

  if (guild_id !== undefined) {
    guild = discord_client_instance.guilds.cache.get(guild_id);
  }
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const month: number = today.getMonth();
  const date: number = today.getDate();

  if (guild !== undefined) {
    for (const common_class of classes) {
      const common_class_info = common_class.commonClassInformation();
      const [start_hours, start_minutes] = common_class_info.class_start_time.split(':').map(Number);
      const [end_hours, end_minutes] = common_class_info.class_end_time.split(':').map(Number);
      const scheduled_start_date = new Date(year, month, date, start_hours, start_minutes);
      const scheduled_end_date = new Date(year, month, date, end_hours, end_minutes);

      if (common_class.does_class_run_on_day(day_of_the_week)) {
        guild.scheduledEvents.create({
          name: common_class_info.class_name,
          scheduledStartTime: scheduled_start_date,
          scheduledEndTime: scheduled_end_date,
          description: common_class_info.class_course_code,
          entityType: GuildScheduledEventEntityType.External,
          privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
          entityMetadata: {
            location: "Zoom"
          }
        });
      }
    }
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