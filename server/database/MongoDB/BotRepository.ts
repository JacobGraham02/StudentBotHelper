import { UUID } from 'crypto';
import DatabaseConnectionManager from './DatabaseConnectionManager';
import IDiscordBotInformation from './IDiscordBotInformation';

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
    public async createBot(discord_bot_information: IDiscordBotInformation): Promise<void> {
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
            console.error(`There was an error when attempting to create a Disord bot document in the database. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
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
