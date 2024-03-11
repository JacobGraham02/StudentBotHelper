import DatabaseConnectionManager from './DatabaseConnectionManager';
import { DiscordBotCommandType } from './types/DiscordBotCommandType';
import { DiscordBotInformationType } from './types/DiscordBotInformationType';
import * as dotenv from "dotenv";
import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob';
import { LogFile } from './types/LogFileType';
import { promises as fs} from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
dotenv.config();

export default class BotRepository {

    private database_connection_manager = new DatabaseConnectionManager();

    public async findBotByEmail(bot_email: string): Promise<any> {
        const database_connection = await this.database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');
            const bot = await bot_collection.findOne({ bot_email: bot_email });
            return bot;
        } catch (error) {
            console.error(`There was an error when attempting to fetch all bot data given a UUID. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    public async findBotByGuildId(guild_id: string): Promise<any> {
        const database_connection = await this.database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');
            const bot = await bot_collection.findOne({ bot_guild_id: guild_id });
            return bot;
        } catch (error) {
            console.error(`There was an error when attempting to fetch all bot data given a UUID. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    /**
     * This database function creates a document in an existing MongoDB database where the document has the specified list of key value pairs defined within it.
     * All of the key-value pairs and their data types can be found in the IDiscordBotInformation interface. 
     * If an existing bot document with the same UUID as the bot document is present, then the document will be updated with new values. 
     * @param discord_bot_information IDiscordBotInformation
     */
    public async createBot(discord_bot_information: DiscordBotInformationType): Promise<void> {
        const database_connection = await this.database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');
    
            // Check if the bot already exists
            const existing_bot = await bot_collection.findOne({ bot_id: discord_bot_information.bot_id });
    
            if (!existing_bot) {
                // Insert new document since it does not exist
                await bot_collection.insertOne({
                    bot_id: discord_bot_information.bot_id,
                    bot_guild_id: discord_bot_information.bot_guild_id,
                    bot_email: discord_bot_information.bot_email,
                    bot_username: discord_bot_information.bot_username,
                    bot_password: discord_bot_information.bot_password
                });
            } 
        } catch (error: any) {
            console.error(`There was an error when attempting to create a new bot document in the database: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }
    

    public async updateBotChannelIds(discord_bot_information: DiscordBotInformationType): Promise<void> {
        const database_connection = await this.database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');
    
            // Check if the bot already exists
            const existing_bot = await bot_collection.findOne({ bot_id: discord_bot_information.bot_id });
    
            if (existing_bot) {
                // Update existing document with only the bot channel IDs
            await bot_collection.updateOne(
                { bot_id: discord_bot_information.bot_id },
                {
                    $set: {
                        bot_role_button_channel_id: discord_bot_information.bot_role_button_channel_id,
                        bot_commands_channel: discord_bot_information.bot_commands_channel_id,
                        bot_command_usage_information_channel: discord_bot_information.bot_command_usage_information_channel_id,
                        bot_command_usage_error_channel: discord_bot_information.bot_command_usage_error_channel_id
                    }
                }
            );
            }
        } catch (error: any) {
            console.error(`There was an error when attempting to update the bot channel IDs in the database. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }
    

    public async createBotCommand(bot_command: DiscordBotCommandType): Promise<void> {
        const database_connection = await this.database_connection_manager.getConnection();

        try {
            const commands_collection = database_connection.collection('commands');

            const new_command_document = {
                bot_id: bot_command.botId,
                command_name: bot_command.commandName,
                command_description: bot_command.commandDescription,
                command_function: bot_command.commandDescriptionForFunction,
                command_users: bot_command.commandAuthorizedUsers
            };

            await commands_collection.updateOne(
                { bot_id: bot_command.botId },
                { $setOnInsert: new_command_document },
                { upsert: true }
            )
        } catch (error: any) {
            console.error(`There was an error when attempting to create Discord bot command in the database. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    public async getBotCommandDocument(command_name: string) {
        const database_connection = await this.database_connection_manager.getConnection();

        try {
            const commands_collection = database_connection.collection('commands');

            const command = await commands_collection.findOne({ command_name: command_name });

            return command;
        } catch (error: any) {
            console.error(`There was an error when attempting to retrieve the bot package by name. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }


    public async getAllBotCommandFiles() {
        const commands_directory = path.join(__dirname, "../../../dist/commands");

        let commandObjects: any[] = [];
        try {
            const commandFiles: string[] = await fs.readdir(commands_directory);
            const jsCommandFiles = commandFiles.filter(file => file.endsWith('.js'));

            for (const file of jsCommandFiles) {
                const filePath = path.join(commands_directory, file);

                try {
                    const commandModule = await import(filePath);
                    const command = commandModule.default();

                    commandObjects.push({
                        data: command.data, // Or serialize if necessary
                        authorization_role_name: command.authorization_role_name,
                        execute: command.execute.toString() // This retains the function reference
                    });
                } catch(fileFetchError) {
                    console.error(`Error processing file ${filePath}: ${fileFetchError}`);
                }
            }
        } catch (error) {
            console.error(`There was an error when attempting to retrieve the bot commands: ${error}`);
            throw error;
        }
        return commandObjects;
    }
    

    public async getBot(bot_id) {
        const database_connection = await this.database_connection_manager.getConnection();

        try {
            const bot_collection = database_connection.collection('bot');

            const bot = await bot_collection.findOne({ bot_id: bot_id });

            return bot;
        } catch (error: any) {
            console.error(`There was an error when attempting to get the bot document from the database: ${error}`);
            throw new Error(`There was an error when attempting to retrieve the bot document from the database. Please try again or inform the server adminstrator of this error: ${error}`);
        }
    }

    private getCurrentDateISO() {
        // Get current date
        const currentDate: Date = new Date();

        // Format current date to YYYY-MM-DD
        const formattedDate: string = currentDate.toISOString().split('T')[0];

        return formattedDate;
    }

    public async writeLogToAzureContainer(fileContents: string, logName: string, containerName: string): Promise<void> {
        const storageAccountConnection: string | undefined = process.env.azure_storage_account_connection_string;
    
        if (!storageAccountConnection) {
            throw new Error(`The azure storage account connection string is undefined or invalid`);
        }
    
        if (!containerName) {
            throw new Error(`The azure storage container name is undefined or invalid`);
        }
    
        const currentDateISO = this.getCurrentDateISO();
    
        // Define blob file name
        const blobFileName = `${currentDateISO}-${logName}.log`;
    
        // Create BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnection);
    
        // Get container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
    
        try {
            await containerClient.createIfNotExists();
    
            // Check if the log file already exists
            const blobClient = containerClient.getBlockBlobClient(blobFileName);
            const exists = await blobClient.exists();
    
            let modifiedFileContents = fileContents;
            
            if (exists) {
                // If the log file exists, append new logs to it
                const existingFileContents = await blobClient.downloadToBuffer();
                modifiedFileContents = existingFileContents.toString() + '\n' + modifiedFileContents;
            }
    
            // Prepend log entry timestamp to each line
            const logFileLineDate = new Date().toISOString();
            modifiedFileContents = modifiedFileContents
                .split('\n')
                .map(line => `${logFileLineDate}: ${line}`)
                .join('\n');
    
            // Upload file contents to blob
            const uploadResponse: BlobUploadCommonResponse = await blobClient.upload(modifiedFileContents, Buffer.byteLength(modifiedFileContents));
    
            // Check if upload was successful
            if (uploadResponse._response.status === 201) {
                console.log(`Log file '${blobFileName}' uploaded successfully.`);
            } else {
                throw new Error(`Failed to upload log file '${blobFileName}'.`);
            }
        } catch (error) {
            console.error(`Error in creating container or uploading log file '${logName}':`, error);
            throw error;
        }
    }
    
    public async readAllLogsFromAzureContainer(containerName: string): Promise<LogFile[]> {
        const storageAccountConnection: string | undefined = process.env.azure_storage_account_connection_string;
    
        if (!storageAccountConnection) {
            throw new Error(`The azure storage account connection string is undefined`);
        }
    
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnection);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const logFiles: LogFile[] = [];

        await containerClient.createIfNotExists();
    
        try {
            // List all blobs in the container
            for await (const blob of containerClient.listBlobsFlat()) {
                if (blob.name.endsWith('.log')) { 
                    const blobClient = containerClient.getBlockBlobClient(blob.name);
                    const downloadResponse = await blobClient.downloadToBuffer();
                    const logContents = downloadResponse.toString();

                    const logFile: LogFile = {
                        name: blob.name,
                        content: logContents
                    }

                    logFiles.push(logFile);
                }
            }
    
            return logFiles;
        } catch (error) {
            console.error(`An error has occurred when attempting to read log files from Microsoft Azure: ${error}`);
            throw new Error(`An error has occurred when attempting to read log files from Micosoft Azure: ${error}`);
        }
    }
    
    public async downloadAllCommandsFromContainer(filePath: string, containerName: string): Promise<void> {
        const storageAccountConnection: string | undefined = process.env.azure_storage_account_connection_string;
    
        if (!storageAccountConnection) {
            throw new Error(`The Azure storage account connection string is undefined or invalid.`);
        }
    
        if (!containerName) {
            throw new Error(`The Azure storage container name is undefined or invalid.`);
        }
    
        // Create BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnection);
    
        // Get container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
    
        try {
            // Ensure the local directory exists
            await mkdir(filePath, { recursive: true });
    
            // List all blobs in the container and download each one
            for await (const blob of containerClient.listBlobsFlat()) {
                const localFilePath = `${filePath}/${blob.name}`;
                const blobClient = containerClient.getBlobClient(blob.name);
                
                // Download the blob's contents and save to a local file
                await blobClient.downloadToFile(localFilePath);
                console.log(`Blog files were downloaded`);
            }
        } catch (error) {
            console.error(`Error downloading commands from container:`, error);
            throw error;
        }
    }

    private async releaseConnectionSafely(database_connection: any): Promise<void> {
        if (database_connection) {
            try {
                await this.database_connection_manager.releaseConnection(database_connection);
            } catch (error) {
                console.error(`An error has occurred during the execution of releaseConnectionSafely function: ${error}`);
                throw new Error(`An error has occurred during the execution of releaseConnectionSafely function: ${error}`);
            }
        }
    }
}
