import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../.env'});
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import { Client, Collection, GatewayIntentBits, GuildMemberRoleManager } from 'discord.js';
import CustomDiscordClient from './utils/CustomDiscordClient.js';
import CustomEventEmitter from './utils/CustomEventEmitter.js';
const discord_bot_token: string | undefined = process.env.discord_bot_token;
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
const custom_event_emitter = new CustomEventEmitter();
const commands_folder_path: string = path.join(__dirname, './commands');
const filtered_commands_files = fs.readdirSync(commands_folder_path).filter(file => file !== 'deploy-commands.js' && !file.endsWith(".map"));
discord_client_instance.discord_commands = new Collection();

async function fetchCommandFiles() {
  for (const command_file of filtered_commands_files) {
    const command_file_path = path.join(commands_folder_path, command_file);
    const command = await import(command_file_path);
    const command_object = command.default();
    discord_client_instance.discord_commands.set(command_object.data.name, command_object);
  }
}
fetchCommandFiles();

discord_client_instance.on('ready', () => {
  console.log(`The bot is logged in as ${discord_client_instance.user!.tag}`)
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
  console.log('Emitted event to record a database operation');
  const discord_channel_for_operation_results = process.env.discord_bot_http_response_channel_id;
  if (!discord_channel_for_operation_results) {
    throw new Error(`The discord channel id for database operation results could not be fetched.`);
  }
  const discord_channel_for_messages = await discord_client_instance.channels.fetch(discord_channel_for_operation_results);
  if (discord_channel_for_messages && discord_channel_for_messages.isTextBased()) {
    discord_channel_for_messages.send(message);
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