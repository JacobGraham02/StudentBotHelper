import express, { Request, Response, NextFunction, Router } from 'express';
import DiscordAPIOperations from '../controllers/BotCommands/DiscordAPIOperations';
const bot_commands_router: Router = express.Router();
import * as dotenv from 'dotenv';
import 'dotenv/config';
import Logger from '../../utils/Logger';
dotenv.config({path: '../../../.env'});

declare global {
    namespace Express {
        interface Request {
            discordApiOperations: DiscordAPIOperations;
            logger: Logger;
            botname: string;
        }
    }
}

function initializeDiscordApiFunctionsMiddleware(request: Request, response: Response, next: NextFunction): void {
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

function ensureDiscordApiOperationsClassNotUndefinedMiddleware(request: Request, response: Response, next: NextFunction): void {
    const discordApiOperations = request.discordApiOperations;
    if (!discordApiOperations) {
        console.error(`The DiscordAPIOperations class obtained from the middleware request is undefined`);
        response.status(500).json({
            message: `The DiscordAPIOperations class obtained from the middleware request is undefined. Please contact the server administrator and inform them of this error`
        });
        return;
    }
    next();
}

function ensureLoggerClassNotUndefinedMiddleware(request: Request, response: Response, next: NextFunction): void {
    const loggerOperations = request.logger;

    if (!loggerOperations) {
        console.error(`The Logger class obtained from the middleware request is undefined`);
        response.status(500).json({
            message: `The Logger class obtained from the middleware request is undefined. Please contact the server administrator and inform them of this error`
        });
        return;
    }
    next();
}

bot_commands_router.post('/registerCommands', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware, 
    ensureLoggerClassNotUndefinedMiddleware, async function(request: Request, response: Response, next: NextFunction) {
    const discordApiOperations = request.discordApiOperations;
    
    try {
        await discordApiOperations.pushCommandsIntoCommandList();
        await discordApiOperations.registerCommandsWithDiscordBot(request, response);
    } catch (error) {
        console.error(`The bot commands have not been registered. Please inform the server administrator of this error`);
        throw error;
    }
});

bot_commands_router.post('/changeDiscordBotName', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware, 
    ensureLoggerClassNotUndefinedMiddleware, async function(request: Request, response: Response, next: NextFunction) {

    const discordApiOperations = request.discordApiOperations;

    try {
        await discordApiOperations.changeDiscordBotName(request, response);
    } catch (error) {
        console.error(`There was an error when attempting to change the Discord bot username. Please try again or contact the server administrator if you believe this is an error`);
        throw error;
    }
});

bot_commands_router.post('/changeDiscordBotAvatar', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware,
    ensureLoggerClassNotUndefinedMiddleware, async function(request: Request, response: Response, next: NextFunction) {

    const discordApiOperations = request.discordApiOperations;

    try {
        await discordApiOperations.changeDiscordBotAvatar(request, response);
    } catch (error) {
        console.error(`There was an error when attempting to change the Discord bot avatar. Please try again or contact the server administrator if you believe this is an error`);
        throw error;
    }
});

export default bot_commands_router;