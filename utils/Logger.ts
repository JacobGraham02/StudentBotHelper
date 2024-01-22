import fs from 'fs/promises';

/**
 * This Logger class provides a basic implementation of asynchronous file write operation, where the bot can write errors or information messages to log files
 * while the application is running. The package used for this is 'fs/promises'. We use this package because 'fs' provides a clean and concise way to asynchronously 
 * write some data to a file. 
 */
export default class Logger {
    log_file_messages_path: string | undefined;
    log_file_errors_path: string | undefined;
    error_and_info_regex_pattern: RegExp = /[a-zA-Z0-9()\[\]'":/.,{} ]{1,1000}/g

    constructor(bot_helper_message_log_path: string | undefined, bot_helper_error_log_path: string | undefined) {
        this.log_file_messages_path = bot_helper_message_log_path;
        this.log_file_errors_path = bot_helper_error_log_path;
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
            console.error(`The error message to write to the error log file is undefined`);
            return;
        }

        const formatted_error_string_date: Date = new Date();
        const formatted_error_string = `${formatted_error_string_date.toISOString()}: ${error}\n`;

        try {
            if (this.log_file_errors_path !== undefined) {
                await fs.appendFile(this.log_file_errors_path, formatted_error_string);
            }
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

        const formatted_message_string_date: Date = new Date();
        const formatted_message_string = `${formatted_message_string_date.toISOString()}: ${message}`;

        try {
            if (this.log_file_messages_path !== undefined) {
                await fs.appendFile(this.log_file_messages_path, formatted_message_string);
            } 
        } catch (error) {
            console.error(`There was an error when attempting to write to the messages log file: ${message}`);
        }
    }
}
