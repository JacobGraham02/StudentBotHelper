import { UUID } from "crypto";

/**
 * Implemented an interface to represent the data object that will be passed to the createBot database function in the BotRepository class.
 * This interface defines all of the properties that exist for that object. 
 */
export default interface IDiscordBotInformation {
    bot_id?: UUID;
    bot_username?: string;
    bot_password?: string;
    bot_email?: string;
    bot_commands_channel_id: string;
    bot_database_responses_channel_id: string;
    bot_github_commits_channel_id: string;
    bot_command_usage_information_channel_id: string;
    bot_command_usage_errors_channel_id: string;
}