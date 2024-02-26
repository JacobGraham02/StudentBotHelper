import { Channel, Client, TextChannel } from 'discord.js';

/**
 * This Logger class provides a basic implementation of asynchronous file write operation, where the bot can write errors or information messages to log files
 * while the application is running. The package used for this is 'fs/promises'. We use this package because 'fs' provides a clean and concise way to asynchronously 
 * write some data to a file. 
 */
export default class Logger {
    log_information_messages_channel_id: string | undefined;
    log_error_messages_channel_id: string | undefined;
    error_and_info_regex_pattern: RegExp = /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g
    discord_client: Client;


    constructor(bot_information_messages_channel_id: string | undefined, bot_error_messages_channel_id: string | undefined, discord_bot_client: Client) {
        this.log_information_messages_channel_id = bot_information_messages_channel_id;
        this.log_error_messages_channel_id = bot_error_messages_channel_id;
        this.discord_client = discord_bot_client;
    }

    /**
     * This is a helper function that utilizes the Discord.js package to send messages into a numerically-identified channel. 
     * @param channel_id string that is an environment variable read from a .env file
     * @param log_message string that is the log message we want to write 
     * @returns nothing regardless of any errors occuring. 
     */
    private async sendMessageToDiscordChannel(channel_id: string, log_message: string) {
        if (!channel_id) {
            return;
        }
        const channel_for_message: Channel | null = await this.discord_client.channels.fetch(channel_id);

        if (!channel_for_message || !(channel_for_message instanceof TextChannel)) {
            return;
        }

        try {
            await channel_for_message.send({content:`${log_message}`});
        } catch (error) {
            console.error(`There was an error when attempting to send a log message to the proper Discord channel. Please contact the site administrator about this error: ${error}`);
        }
    }

    /**
     * This function takes advantage of the new Discord API feature which allows you format time in messages in such a way that the time will
     * display as relative to the client's time zone. This is called Discord's Timestamp Styles. 
     * You must first convert the current date into a unix timestamp, and then wrap that timestamp in the <t: :F> characters.
     * @param message string message we want to log
     * @returns string that displays an ISO 8601 date for compatability, the string message informing the server administrator of messages, and the discord api formatted
     * timestamp. 
     */
    private formatDiscordApiRelativeDate(message: string) {
        const formatted_error_string_date: Date = new Date();

        const unix_timestamp_current_time: number = Math.floor(formatted_error_string_date.getTime() / 1000);

        const discord_api_formatted_timestamp: string = `<t:${unix_timestamp_current_time}:F>`;

        return `${formatted_error_string_date.toISOString()}: ${message}\n${discord_api_formatted_timestamp}`;
    }

    /**
     * Utility function that will check if the supplied string is defined and conforms to the following regex pattern: /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g.
     * @param message string that defines the message we want to write to a log file.
     * @returns true if the message we want to write is both defined and matches the regex pattern; false otherwise. 
     */
    private validateStringIsDefinedAndConformsToRegex(message: string) {
        if (message !== undefined && message.match(this.error_and_info_regex_pattern)) {
            return true;
        }
        return false;
    }

    /**
     * If the error we want to write to the error log file not undefined and matches the message regex pattern /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g, 
     * we will attempt to us the 'fs/promises' package to write the error to a error log file. The attempted write operation is inside of a try/catch block
     * so that any errors that occur when trying to write to the file are caught and the user is informed immediately. 
     * @param error string containing the error message
     * @returns nothing 
     */
    public async logError(error: string) {
        if (!this.validateStringIsDefinedAndConformsToRegex(error)) {
            console.error(`The error message that we want to write to the Discord error messages text channel is undefined or null`);
            return;
        }

        const formatted_error_message_string = this.formatDiscordApiRelativeDate(error);

        if (typeof this.log_error_messages_channel_id === 'undefined') {
            console.error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
            return;
        }

        try {
            await this.sendMessageToDiscordChannel(this.log_error_messages_channel_id, formatted_error_message_string);
        } catch (error) {
            console.error(`There was an error when attempting to write to the errors log file: ${error}`);
        }
    }

     /**
     * If the error we want to write to the message log file not undefined and matches the message regex pattern /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g, 
     * we will attempt to us the 'fs/promises' package to write the message to a message log file. The attempted write operation is inside of a try/catch block
     * so that any errors that occur when trying to write to the file are caught and the user is informed immediately. 
     * @param error string containing the log message
     * @returns nothing 
     */
    public async logMessage(message: string) {
        if (!this.validateStringIsDefinedAndConformsToRegex(message)) {
            console.error(`The information message to write to the message log file is undefined`);
            return;
        }
        
        const formatted_information_message_string = this.formatDiscordApiRelativeDate(message);

        if (typeof this.log_information_messages_channel_id === 'undefined') {
            console.error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
            return;
        }

        try {
            await this.sendMessageToDiscordChannel(this.log_information_messages_channel_id, formatted_information_message_string);
        } catch (error) {
            console.error(`There was an error when attempting to write to the messages log file: ${message}`);
        }
    }
}
