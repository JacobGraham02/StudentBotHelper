import { Channel, Client, TextChannel } from 'discord.js';

export default class Logger {
    error_and_info_regex_pattern: RegExp = /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g
    discord_client: Client | undefined;

    constructor(discord_bot_client?: Client) {
        if (discord_bot_client) { 
            this.discord_client = discord_bot_client;
        }
    }

    private async sendMessageToDiscordChannel(channel: Channel, log_message: string) {
        if (!this.discord_client) {
            console.error(`The discord bot instance is undefined or null. Please inform the server administrator of this error`);
            throw new Error(`The discord bot instance is undefined or null. Please inform the server administrator of this error`);
        }

        try {
            if (channel.isTextBased()) {
                channel.send({content:`${log_message}`})
            }
        } catch (error) {
            console.error(`There was an error when attempting to send a log message to the proper Discord channel. Please contact the site administrator about this error: ${error}`);
            throw new Error(`There was an error when attempting to send a log message to the proper Discord channel. Please contact the site administrator about this error: ${error}`);
        }
    }

    private formatDiscordApiRelativeDate(message: string) {
        const formatted_error_string_date: Date = new Date();
        const unix_timestamp_current_time: number = Math.floor(formatted_error_string_date.getTime() / 1000);
        const discord_api_formatted_timestamp: string = `<t:${unix_timestamp_current_time}:F>`;
        return `${formatted_error_string_date.toISOString()}: ${message}\n${discord_api_formatted_timestamp}`;
    }

    private formatLogMessageToRelativeDate(message: string) {
        const formatted_error_string_date: Date = new Date();
        const timezoneOffset: number = formatted_error_string_date.getTimezoneOffset();
        const timestamp_adjusted_for_timezone: number = formatted_error_string_date.getTime() - (timezoneOffset * 60 * 1000);
        const adjusted_date: Date = new Date(timestamp_adjusted_for_timezone);
        const formatted_date: string = adjusted_date.toLocaleString();
        return `${formatted_date}: ${message}`;
    }

    private validateStringIsDefinedAndConformsToRegex(message: string) {
        if (message !== undefined && message.match(this.error_and_info_regex_pattern)) {
            return true;
        }
        return false;
    }

    public async logDiscordError(channel: Channel | undefined, error: string) {
        if (!this.validateStringIsDefinedAndConformsToRegex(error)) {
            console.error(`The error message that we want to write to the Discord error messages text channel is undefined or null`);
            throw new Error(`The error message that we want to write to the Discord error messages text channel is undefined or null`);
        }

        const formatted_error_message_string = this.formatDiscordApiRelativeDate(error);

        if (!channel) {
            console.error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
            throw new Error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
        }

        try {
            await this.sendMessageToDiscordChannel(channel, formatted_error_message_string);
        } catch (error) {
            console.error(`There was an error when attempting to write to the errors log file: ${error}`);
            throw new Error(`There was an error when attempting to write to the errors log file: ${error}`);
        }
    }

    public async logDiscordMessage(channel: Channel | undefined, message: string) {
        if (!this.validateStringIsDefinedAndConformsToRegex(message)) {
            console.error(`The information message to write to the message log Discord channel is undefined`);
            throw new Error(`The information message to write to the message log Discord channel is undefined`);
        }
        
        const formatted_information_message_string = this.formatDiscordApiRelativeDate(message);

        if (!channel) {
            console.error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
            throw new Error(`There was an error writing the error log message to Discord because the channel id for error log messages is undefined. Please contact your server administrator and inform them of this`);
        }

        try {
            await this.sendMessageToDiscordChannel(channel, formatted_information_message_string);
        } catch (error) {
            console.error(`There was an error when attempting to write to the messages log file: ${message}`);
            throw new Error(`There was an error when attempting to write to the messages log file: ${message}`);
        }
    }

    public async getWebsiteLogMessage(message: string) {
        if (!this.validateStringIsDefinedAndConformsToRegex(message)) {
            console.error(`The information message to write to the bot website contains invalid characters. Please inform the server administrator if you believe this is an error`);
            throw new Error(`The information message to write to the bot website contains invalid characters. Please inform the server administrator if you believe this is an error`);
        }

        const formatted_information_message_string = this.formatLogMessageToRelativeDate(message);

        return formatted_information_message_string;
    }
}
