import express, { Request, Response, NextFunction, Router, json } from "express";
import { body, validationResult } from 'express-validator';
import DiscordAPIOperations from "../controllers/BotCommands/DiscordAPIOperations";
import BotRepository from "../../database/MongoDB/BotRepository";
import BotController from "../controllers/BotController";
const bot_commands_router: Router = express.Router();
import * as dotenv from "dotenv";
import "dotenv/config";
import Logger from "../../utils/Logger";
import { DiscordBotCommandType } from "../../database/MongoDB/types/DiscordBotCommandType";
import CommandRequestEmail from "../../utils/CommandRequestEmail";
import { UUID } from "crypto";
import { DiscordBotInformationType } from "../../database/MongoDB/types/DiscordBotInformationType";
dotenv.config({ path: "../../../.env" });

/**
 * This is used to declare a custom interface that the compiler will use that allows the developer to
 * create a custom request. In this instance, we are attaching the Logger class instance and the
 * DiscordAPIOperations class instance to the request for use at a later time.
 */
declare global {
  namespace Express {
    interface Request {
      discordApiOperations: DiscordAPIOperations;
      logger: Logger;
    }
  }
}

/**
 * Middleware function that attaches the DiscordAPIOperations class instance and Logger class instance to any incoming request, and forwards the modified request
 * to the next function in the call stack.
 * @param request Request incoming to the function
 * @param response Response that is outgoing from the middleware, which has the Logger and DiscordAPIOperations class instances attached
 * @param next NextFunction that is the next function in the call stack
 * @returns {void}
 */
function initializeDiscordApiFunctionsMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const registerBotCommands = new DiscordAPIOperations(
    process.env.discord_bot_token,
    process.env.discord_bot_application_id,
    process.env.discord_bot_guild_id
  );
  const websiteLogger = new Logger();
  request.logger = websiteLogger;
  request.discordApiOperations = registerBotCommands;
  next();
}

/**
 * Middleware function that validates whether the DiscordAPIOperations class instance that is attached to the incoming request is not a falsy value
 * @param request Request that is incoming with both the Logger and DiscordAPIOperations class instances attached
 * @param response Response that is outgoing from the middleware, which has the Logger and DiscordAPIOperations class instances attached
 * @param next NextFunction that is the next function in the call stack
 * @returns {void}
 */
function ensureDiscordApiOperationsClassNotUndefinedMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const discordApiOperations = request.discordApiOperations;
  if (!discordApiOperations) {
    console.error(
      `The DiscordAPIOperations class obtained from the middleware request is undefined`
    );
    response.status(500).json({
      message: `The DiscordAPIOperations class obtained from the middleware request is undefined. Please contact the server administrator and inform them of this error`,
    });
    return;
  }
  next();
}

/**
 * Middleware function that validates whether the Logger class instance that is attached to the incoming request is not a falsy value
 * @param request Request that is incoming with both the Logger and DiscordAPIOperations class instances attached
 * @param response Response that is outgoing from the middleware, which has the Logger and DiscordAPIOperations class instances attacheds
 * @param next NextFunction that is the next function in the call stack
 * @returns {void}
 */
function ensureLoggerClassNotUndefinedMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const loggerOperations = request.logger;

  if (!loggerOperations) {
    console.error(
      `The Logger class obtained from the middleware request is undefined`
    );
    response.status(500).json({
      message: `The Logger class obtained from the middleware request is undefined. Please contact the server administrator and inform them of this error`,
    });
    return;
  }
  next();
}

/**
 * When the API endpoint '/registerCommands' is triggered, this routing function will do the following:
 *  1. Use middleware to determine if both the Logger and DiscordAPIOperations classes are truthy
 *  2. Assign the request DiscordAPIOperations class instance to a variable for use
 *  3. Use a try/catch clause to:
 *    3.1: Push the modified commands into the command list
 *    3.2: Register all of the commands in the command list with the Discord bot
 *  4. If an error occurs, propogate the error up the call stack by throwing the error, and informing the user an error has occurred.
 */
bot_commands_router.post(
  "/registerCommands",
  initializeDiscordApiFunctionsMiddleware,
  ensureDiscordApiOperationsClassNotUndefinedMiddleware,
  ensureLoggerClassNotUndefinedMiddleware,
  async function (request: Request, response: Response, next: NextFunction) {
    const discordApiOperations = request.discordApiOperations;

    try {
      await discordApiOperations.pushCommandsIntoCommandList();
      await discordApiOperations.registerCommandsWithDiscordBot(
        request,
        response
      );
    } catch (error) {
      console.error(
        `The bot commands have not been registered. Please inform the server administrator of this error`
      );
      throw error;
    }
  }
);

/**
 * When the API endpoint '/registerCommands' is triggered, this routing function will do the following:
 *  1. Use middleware to determine if both the Logger and DiscordAPIOperations classes are truthy
 *  2. Assign the request DiscordAPIOperations class instance to a variable for use
 *  3. Use a try/catch clause to:
 *    3.1: Change the Discord bot name
 *  4. If an error occurs, propogate the error up the call stack by throwing the error, and informing the user an error has occurred.
 */
bot_commands_router.post(
  "/changeDiscordBotName",
  initializeDiscordApiFunctionsMiddleware,
  ensureDiscordApiOperationsClassNotUndefinedMiddleware,
  ensureLoggerClassNotUndefinedMiddleware,
  async function (request: Request, response: Response, next: NextFunction) {
    const discordApiOperations = request.discordApiOperations;

    try {
      await discordApiOperations.changeDiscordBotName(request, response);
    } catch (error) {
      console.error(
        `There was an error when attempting to change the Discord bot username. Please try again or contact the server administrator if you believe this is an error`
      );
      throw error;
    }
  }
);

/**
 * When the API endpoint '/changeDiscordBotAvatar' is triggered, this routing function will do the following:
 *  1. Use middleware to determine if both the Logger and DiscordAPIOperations classes are truthy
 *  2. Assign the request DiscordAPIOperations class instance to a variable for use
 *  3. Use a try/catch clause to:
 *    3.1: Change the Discord bot avatar
 *  4. If an error occurs, propogate the error up the call stack by throwing the error, and informing the user an error has occurred.
 */
bot_commands_router.post(
  "/changeDiscordBotAvatar",
  initializeDiscordApiFunctionsMiddleware,
  ensureDiscordApiOperationsClassNotUndefinedMiddleware,
  ensureLoggerClassNotUndefinedMiddleware,
  async function (request: Request, response: Response, next: NextFunction) {
    const discordApiOperations = request.discordApiOperations;

    try {
      await discordApiOperations.changeDiscordBotAvatar(request, response);
    } catch (error) {
      console.error(
        `There was an error when attempting to change the Discord bot avatar. Please try again or contact the server administrator if you believe this is an error`
      );
      throw error;
    }
  }
);

bot_commands_router.post("/configs", [ /*
    Express-validator server-side validation chains for input fields by the user. Middleware is then used to handle the request after validation
    */
    body('guildId').matches(/^[0-9]{18}$/).withMessage("The Discord guild id must be a string of 18 numbers"),
    body('commandChannelId').matches(/^[0-9]{18}$/).withMessage("The Discord channel id must be a string of 18 numbers"),
    body('buttonChannelId').matches(/^[0-9]{18}$/).withMessage("The Discord bot role button channel id must be a string of 18 numbers"),
    body('botInfoChannelId').matches(/^[0-9]{18}$/).withMessage("The Discord bot info channel id must be a string of 18 numbers"),
    body('botErrorChannelId').matches(/^[0-9]{18}$/).withMessage("The Discord bot error channel id must be a string of 18 numbers")
    ], 
    
    async function (request: Request, response: Response, next: NextFunction) {
    const {
      guildId,
      commandChannelId,
      buttonChannelId,
      botInfoChannelId,
      botErrorChannelId,
    }: {
      guildId: string;
      commandChannelId: string;
      buttonChannelId: string;
      botInfoChannelId: string;
      botErrorChannelId: string;
    } = request.body;
  
    const requestValidationErrors = validationResult(request);
    if (!requestValidationErrors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: `Please try submitting the form again with the correct inputs as specified on the form`
      }); 
    }
    
    const config_object = {
      bot_guild_id: guildId,
      bot_commands_channel_id: commandChannelId,
      bot_role_button_channel_id: buttonChannelId,
      bot_command_usage_information_channel_id: botInfoChannelId,
      bot_command_usage_error_channel_id: botErrorChannelId,
    };

    try {
      const bot_database_repository_instance: BotRepository =
        new BotRepository();
      const bot_controller_instance: BotController = new BotController(
        bot_database_repository_instance
      );

      await bot_controller_instance.insertBotDocumentIntoMongoDB(config_object);

      return response.status(200).json({
        success: true,
        message: "Bot configuration values updated successfully",
      });
    } catch (error) {
      console.error(
        `An error occurred when attempting to update the bot configuration values in the /configs endpoint: ${error}`
      );
      return response.status(500).json({
        success: false,
        message: `An internal server error occurred when attempting to update the bot configuration values in the /configs endpoint`,
      });
    }
  }
);

bot_commands_router.post("/commands", [ /*
    Express-validator server-side validation chains for input fields by the user. Middleware is then used to handle the request after validation
    */
    body('commandName').matches(/^[a-zA-Z0-9 ]{1,32}$/).withMessage("The command name must be a string of 1-32 letters and/or numbers (e.g., Bot command 1"),
    body('commandDescription').matches(/^[a-zA-Z0-9 ]{1,100}$/).withMessage("The command description must be a string of 1-100 letters and/or numbers (e.g., This command does stuff"),
    body('commandDescriptionForFunction').matches(/^[a-zA-Z0-9 ]{1,1000}$/).withMessage("The description for the actual functionality of the command must be a string of 1-1000 letters and/or numbers (e.g., This command will respond to a user with 'Ping' of they use the command '/pong'"),
    body('commandAuthorizedUsers').isArray().withMessage('You cannot request a command be created where no users can use it')
    .custom((users) => users.every((user: any) => typeof user === 'string')).withMessage('Each authorized user must be 1-00 letters and/or numbers (e.g., Server administrator'),
    ], 
    
    async function (request: Request, response: Response, next: NextFunction) {
    const {
      commandName,
      commandDescription,
      commandDescriptionForFunction,
      commandAuthorizedUsers,
    }: {
      commandName: string,
      commandDescription: string,
      commandDescriptionForFunction: string,
      commandAuthorizedUsers: string[],
    } = request.body;
  
    const requestValidationErrors = validationResult(request);

    if (!requestValidationErrors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: `Please try submitting the form again with the correct inputs as specified on the form`
      }); 
    }
    
    const command_object: DiscordBotCommandType = {
      botId: 1,
      commandName: commandName,
      commandDescription: commandDescription,
      commandDescriptionForFunction: commandDescriptionForFunction,
      commandAuthorizedUsers: commandAuthorizedUsers
    };

    try {
      const bot_database_repository_instance: BotRepository = new BotRepository();
      const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);
      
      await bot_controller_instance.insertBotCommandDocument(command_object);

      return response.status(200).json({
        success: true,
        message: "Bot command inserted successfully",
      });
    } catch (error) {
      console.error(`An error occurred when attempting to insert a new bot command using the /command endpoint: ${error}`);
      return response.status(500).json({ 
        success: false, 
        message: `An internal server error occurred when attempting to insert a new bot command at the /configs endpoint` 
      });
    }
  }
);

bot_commands_router.post('/newcommandrequest', [ /*
  Express-validator server-side validation chains for input fields by the user. Middleware is then used to handle the request after validation
  */
  body('commandName').matches(/^[a-zA-Z0-9 ]{1,32}$/).withMessage("The command name must be a string of 1-32 letters and/or numbers (e.g., Bot command 1)"),
  body('commandDescription').matches(/^[a-zA-Z0-9 ]{1,100}$/).withMessage("The command description must be a string of 1-100 letters and/or numbers (e.g., This command does stuff)"),
  body('commandDescriptionForFunction').matches(/^[a-zA-Z0-9 ]{1,1000}$/).withMessage("The description for the actual functionality of the command must be a string of 1-1000 letters and/or numbers (e.g., This command will respond to a user with 'Ping' of they use the command '/pong')"),
  body('commandAuthorizedUsers').isArray().withMessage('You cannot request a command be created where no users can use it')
  .custom((users) => users.every((user: any) => typeof user === 'string')).withMessage('Each authorized user must be 1-00 letters and/or numbers (e.g., Server administrator)'),
  ], 

  async function (request: Request, response: Response, next: NextFunction) {
  const {
    commandName,
    commandDescription,
    commandDescriptionForFunction,
    commandAuthorizedUsers,
  }: {
    commandName: string,
    commandDescription: string,
    commandDescriptionForFunction: string,
    commandAuthorizedUsers: string[],
  } = request.body;

  const requestValidationErrors = validationResult(request);

  if (!requestValidationErrors.isEmpty()) {
    return response.status(400).json({
      success: false,
      message: `Please try submitting the form again with the correct inputs as specified on the form`
    });
  }

  const new_command_request: DiscordBotCommandType = {
    botId: 1,
    commandName: commandName,
    commandDescription: commandDescription,
    commandDescriptionForFunction: commandDescriptionForFunction,
    commandAuthorizedUsers: commandAuthorizedUsers
  }

  try {
    const new_command_class = new CommandRequestEmail();
    await new_command_class.sendEmail(new_command_request);

    return response.status(200).json({
      success: true,
      message: "Command request sent successfully",
    });
  } catch (error) {
    console.error(`An error occurred when attempting to send a command request to the admin email using the /newcommandrequest endpoint ${error}`);
    return response.status(500).json({ 
      success: false, 
      message: `An error occurred when attempting to send a command request to the admin email using the /newcommandrequest endpoint` 
    });
  }
});

bot_commands_router.get('/getcommands', async function (request: Request, response: Response, next: NextFunction) {
  try {
    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);
    
    const commands = await bot_controller_instance.getAllCommandFiles();

    return response.status(200).json({
      data: commands
    });
  } catch (error) {
    console.error(`An error occurred when attempting to retrieve all bot commands from the database: ${error}`);
    throw new Error(`There was an error when attempting to retrieve the bot commands. Please inform the server administrator of this error: ${error}`);
  }
});

bot_commands_router.patch('/updatebotid', async function(request: Request, response: Response, next: NextFunction) {
  try {
    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    const changeBotId = await bot_controller_instance.updateBotId(request.body.bot_id);

    return changeBotId;
  } catch (error) {
    console.error(`An error occurred when attempting to update the bot id in the database: ${error}`);
    throw new Error(`An error occurred when attempting to update the bot id in the database. Please inform the server administrator of this error: ${error}`);
  }
});

bot_commands_router.patch('/updatechannelids', async function(request: Request, response: Response, next: NextFunction) {
  const {
    bot_id,
    bot_guild_id,
    bot_command_channel_id,
    bot_button_channel_id,
    bot_info_channel_id,
    bot_error_channel_id
  }: {
    bot_id: UUID
    bot_guild_id: string,
    bot_command_channel_id: string,
    bot_button_channel_id: string,
    bot_info_channel_id: string,
    bot_error_channel_id: string
  } = request.body;

  const updateChannelIdsObject: DiscordBotInformationType = {
    bot_id: bot_id,
    bot_guild_id: bot_guild_id,
    bot_commands_channel_id: bot_command_channel_id,
    bot_role_button_channel_id: bot_button_channel_id,
    bot_command_usage_information_channel_id: bot_info_channel_id,
    bot_command_usage_error_channel_id: bot_error_channel_id
  }

  try {
    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    const changeBotChannelIds = await bot_controller_instance.updateBotChannelIds(updateChannelIdsObject);

    return changeBotChannelIds;
  } catch (error) {
    console.error(`An error occurred when attempting to update the bot channel ids in the database: ${error}`);
    throw new Error(`An error occurred when attempting to update the bot channel ids in the database. Please inform the server administrator of this error: ${error}`);
  }
});

bot_commands_router.get('/getlogs', async function(request: Request, response: Response, next: NextFunction) {
  try {
    const containerName = request.query.containerName as string;

    if (!containerName) {
      return response.status(400).json(`The container name is undefined or null`);
    }

    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    const logfiles = await bot_controller_instance.getAllLogFilesFromContainer(containerName);

    response.json(logfiles);
  } catch (error) {
    console.error(`An error occurred when attempting to retrieve all bot log files from the container ${request.body.containerName}: ${error}`);
    throw new Error(`An error occurred when attempting to retrieve all bot log files from the container ${request.body.containerName}: ${error}`);
  }
});

bot_commands_router.get('/bot', async function(request: Request, response: Response, next: NextFunction) {
  const {
    bot_id
  }: {
    bot_id: UUID
  } = request.body;
  
  try {
    
    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    const bot = await bot_controller_instance.getBotDocument(bot_id);

    response.json(bot);
  } catch (error) {
    console.error(`An error occurred when attempting to retrieve the bot document from the database: ${error}`);
    throw new Error(`An error occurred when attempting to retrieve the bot from the database. Please try again or inform the server administrator of this error: ${error}`);
  }
});

bot_commands_router.put('/writelog', async function(request: Request, response: Response, next: NextFunction) {
  const {
    logFileName,
    containerName,
    fileContents
  }: {
    logFileName: string,
    containerName: string,
    fileContents: string
  } = request.body;

  try {

    if (!containerName) {
      return response.status(400).json(`The container name is undefined or null`);
    } 

    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    await bot_controller_instance.writeLogFileToContainer(logFileName, containerName, fileContents);

    response.json(`You have successfully added a log file to the container: ${containerName}`); 
  } catch (error) {
    console.error(`There was an error when attempting to write a log file to the specified container: ${error}`);
    throw new Error(`There was an error when attempting to write a log file to the specified container: ${error}`);
  }
});

bot_commands_router.put('/writecommand', async function(request: Request, response: Response, next: NextFunction) {
  const {
    containerName
  }: {
    containerName: string
  } = request.body;

  try {
    if (!containerName) {
      return response.status(400).json(`The container name is undefined or null`);
    }

    const bot_database_repository_instance: BotRepository = new BotRepository();
    const bot_controller_instance: BotController = new BotController(bot_database_repository_instance);

    // await bot_controller_instance.writeCommandFileToContainer(commandFileData, containerName);

    response.json(`You have successfully added the command file to the container: ${containerName}`); 
  } catch (error) {
    console.error(`There was an error when attempting to write the command file to the specified container: ${error}`);
    throw new Error(`There was an error when attempting to write the command file to the specified container: ${error}`);
  }
});

export default bot_commands_router;
