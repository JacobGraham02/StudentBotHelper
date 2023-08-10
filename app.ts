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
  let error_message = '';
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
        console.error(error);
        //await interaction.reply({content: `There was an error when attempting to execute the command ${command}. Please inform the bot developer of this error`});
      }
  } else {
    await interaction.reply({content: `You do not have permission to execute the command ${command.data.name}. Please contact your bot administrator if this is an error`});
  }
});

discord_client_instance.login(discord_bot_token);

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

// const commands_path = path.join(__dirname, 'commands');
// const command_files_list = fs.readdirSync(commands_path).filter(file => file.endsWith('.js'));

// /**
//  * Define 2 properties on the client_instance object, which will both be empty collections. 
//  */
// client_instance.commands = new Collection();
// client_instance.discord_commands = new Collection();

// /**
//  * Using the command_files_list we populated earlier, we have to dynamically import each of the functions and extract the object returned from those functions.
//  * After we have retrieved the functions and objects, we put the imported functions into client_instance.commands, and the function objects into client_instance.discord_commands
//  */

// /**
//  * The discord API triggers an event called 'ready' when the discord bot is ready to respond to commands and other input. 
//  */
// client_instance.on('ready', () => {
//     console.log(`The bot is logged in as ${client_instance.user.tag}`);
// });

// /**
//  * When an interaction (command) to executed on discord - for example: !discord - the discord API triggers an event called 'interactionCreate'. 
//  */
// client_instance.on('interactionCreate',
//     /**
//      * When the discord API triggers the interactionCreate event, an asynchronous function is executed with the interaction passed in as a parameter value. 
//      * If the interaction is not a command, the function does not continue executing.
//      * @param {any} interaction 
//      * @returns ceases execution of the function if the interaction is not a command, if the user sent the message in the wrong channel, or if the user cannot use this command
//      */
//     async (interaction) => {
//     if (!interaction.isCommand()) {
//         return;
//     }

//     /**
//      * The in-memory collection that stores the discord command is searched. If the collection contains the target interaction, we fetch that command for use later.
//      */
    
//     const command = client_instance.discord_commands.get(interaction.commandName);

//     if (!command) {
//         return;
//     }

//     if (!(determineIfUserMessageInCorrectChannel(interaction.channel.id, discord_chat_channel_bot_commands))) {
//         await interaction.reply({ content: `You are using this command in the wrong channel` });
//         return;
//     }
    
//     if (determineIfUserCanUseCommand(interaction.member, command.authorization_role_name)) { 
//         try {
//             await command.execute(interaction);
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({ content: 'There was an error while executing this command!', ephermal: true });
//         }

//     } else {
//         await interaction.reply({ content: `You do not have permission to execute the command ${command.data.name}` });
//     }
// });