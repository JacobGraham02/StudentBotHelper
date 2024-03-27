export type DiscordBotCommandType = {
    botId: string;
    botGuildId: string;
    commandName: string;
    commandDescription: string;
    commandDescriptionForFunction: string;
    commandAuthorizedUsers: string[];
}
