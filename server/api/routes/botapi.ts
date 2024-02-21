import express, { Request, Response, NextFunction, Router } from 'express';
import DiscordAPIOperations from '../controllers/BotCommands/DiscordAPIOperations';
const bot_commands_router: Router = express.Router();
import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../../../.env'});

declare global {
    namespace Express {
        interface Request {
            discordApiOperations: DiscordAPIOperations;
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
    request.discordApiOperations = registerBotCommands;
    next();
}

function ensureDiscordApiOperationsClassNotUndefinedMiddleware(request: Request, response: Response, next: NextFunction): void {
    const discordApiOperations = request.discordApiOperations;
    if (typeof discordApiOperations === 'undefined') {
        console.error(`The DiscordAPIOperations class obtained from the middleware request is undefined`);
        response.status(500).json({
            message: `The DiscordAPIOperations class obtained from the middleware request is undefined`
        });
        return;
    }
    next();
}

bot_commands_router.post('/registerCommands', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware, 
    async function(request: Request, response: Response, next: NextFunction) {

    const discordApiOperations = request.discordApiOperations;
    if (discordApiOperations) {
        await discordApiOperations.pushCommandsIntoCommandList();
        await discordApiOperations.registerCommandsWithDiscordBot(request, response);
    }
});

bot_commands_router.post('/changeDiscordBotName', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware, 
    async function(request: Request, response: Response, next: NextFunction) {

    const discordApiOperations = request.discordApiOperations;
    if (discordApiOperations) {
        await discordApiOperations.changeDiscordBotName(request, response);
    }
});

bot_commands_router.post('/changeDiscordBotAvatar', initializeDiscordApiFunctionsMiddleware, ensureDiscordApiOperationsClassNotUndefinedMiddleware,
    async function(request: Request, response: Response, next: NextFunction) {

    const discordApiOperations = request.discordApiOperations;
    if (discordApiOperations) {
        await discordApiOperations.changeDiscordBotAvatar(request, response);
    }
});

export default bot_commands_router;