import express, { Request, Response, NextFunction, Router } from 'express';
import RegisterBotCommands from '../controllers/BotCommands/RegisterBotCommands';
const bot_commands_router: Router = express.Router();
import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../../../.env'});

bot_commands_router.post('/registerCommands', function(request: Request, response: Response, next: NextFunction) {
    const registerBotCommands = new RegisterBotCommands(
        process.env.discord_bot_token,
        process.env.discord_bot_application_id,
        process.env.discord_bot_guild_id
    );
    registerBotCommands.pushCommandsIntoCommandList();
    registerBotCommands.registerCommandsWithDiscordBot(request, response);
});

export default bot_commands_router;