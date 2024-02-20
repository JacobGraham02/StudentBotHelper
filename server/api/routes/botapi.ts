import express, { Request, Response, NextFunction, Router } from 'express';
import RegisterBotCommands from '../controllers/BotCommands/RegisterBotCommands';
const bot_commands_router: Router = express.Router();

bot_commands_router.post('/registerCommands', function(request: Request, response: Response, next: NextFunction) {
    
});

export default bot_commands_router;