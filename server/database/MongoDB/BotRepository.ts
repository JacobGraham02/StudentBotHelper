import { UUID } from 'crypto';
import DatabaseConnectionManager from './DatabaseConnectionManager';
import { DiscordBotCommandType } from './types/DiscordBotCommandType';
import { DiscordBotInformationType } from './types/DiscordBotInformationType';
import * as dotenv from "dotenv";
import { BlobServiceClient, BlobUploadCommonResponse, ContainerClient } from '@azure/storage-blob';
dotenv.config();

export default class BotRepository {

    private database_connection_manager = new DatabaseConnectionManager();

    public async findBotByUUID(bot_uuid: UUID): Promise<any> {
        const database_connection = await this.database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');
            const bot = await bot_collection.findOne({ bot_uuid: bot_uuid });
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

            const new_discord_bot_information_document = {
                bot_id: discord_bot_information.bot_id,
                bot_email: discord_bot_information.bot_email,
                bot_username: discord_bot_information.bot_username,
                bot_password: discord_bot_information.bot_password,
                bot_commands_channel: discord_bot_information.bot_commands_channel_id,
                bot_command_usage_information_channel: discord_bot_information.bot_command_usage_information_channel_id,
                bot_command_usage_error_channel: discord_bot_information.bot_command_usage_errors_channel_id
            };

            await bot_collection.updateOne(
                { bot_id: discord_bot_information.bot_id },
                { $setOnInsert: new_discord_bot_information_document },
                { upsert: true }
            );
        } catch (error: any) {
            console.error(`There was an error when attempting to create a Discord bot document in the database. Please inform the server administrator of this error: ${error}`);
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
                { upsert: true}
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

    public async getAllBotCommandDocuments() {
        const database_connection = await this.database_connection_manager.getConnection();
    
        try {
            let command_objects: any = [];
            const commands_collection = database_connection.collection('commands');
    
            const commands = await commands_collection.find({ bot_id: 1 }).toArray();

            for (let i = 0; i < commands.length; i++) {
                command_objects.push(commands[i]);
            }
            
            return command_objects;
        } catch (error: any) {
            console.error(`There was an error when attempting to retrieve the bot commands. Please inform the server administrator of this error: ${error}`);
            throw new Error(`There was an error when attempting to retrieve the bot commands. Please inform the server administrator of this error: ${error}`);
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    async logFileExists(containerClient: ContainerClient, logFileName: string): Promise<boolean> {
        const blobClient = containerClient.getBlockBlobClient(logFileName);
        const exists = await blobClient.exists();
        return exists;
    }

    private getCurrentDateISO() {
        // Get current date
        const currentDate: Date = new Date();

        // Format current date to YYYY-MM-DD
        const formattedDate: string = currentDate.toISOString().split('T')[0];

        return formattedDate;
    }

    public async writeLogToAzureContainer(logName: string, fileContents: string) {
        const storageAccountConnection: string | undefined = process.env.azure_storage_account_connection_string;
        const azureContainerName: string | undefined = process.env.azure_container_name_for_logs;
    
        if (!storageAccountConnection) {
            return new Error(`The azure storage account connection string is undefined`);
        }
    
        if (!azureContainerName) {
            return new Error(`The azure storage container name is undefined`);
        }
    
        // Create BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnection);
    
        // Get container client
        const containerClient = blobServiceClient.getContainerClient(azureContainerName);

        // Ensure the container exists
        await this.logFileExists(containerClient, azureContainerName);
    
        // Get current date in ISO format
        const currentDate = this.getCurrentDateISO();
    
        // Define blob file name
        const blobFileName = `${currentDate}-${logName}.log`;
    
        try {
            // Get blob client for the file
            const blobClient = containerClient.getBlockBlobClient(blobFileName);
    
            // Upload file contents to blob
            const uploadResponse: BlobUploadCommonResponse = await blobClient.upload(fileContents, fileContents.length);
    
            // Check if upload was successful
            if (uploadResponse._response.status === 201) {
                console.log(`Log file '${blobFileName}' uploaded successfully.`);
            } else {
                throw new Error(`Failed to upload log file '${blobFileName}'.`);
            }
        } catch (error) {
            console.error(`Error uploading log file '${blobFileName}':`, error);
            throw error;
        }
    }
    
    public async readLogFromAzureContainer(logFileName: string): Promise<string | null> {
        const storageAccountConnection: string | undefined = process.env.azure_storage_account_connection_string;
        const azureContainerName: string | undefined = process.env.azure_container_name_for_logs;
    
        if (!storageAccountConnection) {
            throw new Error(`The azure storage account connection string is undefined`);
        }
    
        if (!azureContainerName) {
            throw new Error(`The azure storage container name is undefined`);
        }
    
        // Create BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnection);
    
        // Get container client
        const containerClient = blobServiceClient.getContainerClient(azureContainerName);
    
        try {
            // Check if log file exists
            const fileExists = await this.logFileExists(containerClient, logFileName);
    
            if (fileExists) {
                // Get blob client for the file
                const blobClient = containerClient.getBlockBlobClient(logFileName);
    
                // Download blob content
                const downloadResponse = await blobClient.downloadToBuffer();
    
                // Convert buffer to string
                const fileContents = downloadResponse.toString();
    
                return fileContents;
            } else {
                console.log(`Log file '${logFileName}' does not exist.`);
                return null;
            }
        } catch (error) {
            console.error(`Error reading log file '${logFileName}':`, error);
            throw error;
        }
    }
    

    private async releaseConnectionSafely(database_connection: any): Promise<void> {
        if (database_connection) {
            try {
                await this.database_connection_manager.releaseConnection(database_connection);
            } catch (error) {
                console.error(`An error has occurred during the execution of releaseConnectionSafely function: ${error}`);
                throw error;
            }
        }
    }
}
