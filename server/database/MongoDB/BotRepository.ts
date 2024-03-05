import DatabaseConnectionManager from './DatabaseConnectionManager';

const database_connection_manager = new DatabaseConnectionManager();

export default class BotRepository {

    public async findBotByUUID(bot_uuid: string): Promise<any> {
        const database_connection = await database_connection_manager.getConnection();
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

    public async createBot(bot_information: any, discord_server_data_id: string, ftp_server_data_id: string, bot_packages: any): Promise<void> {
        const database_connection = await database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');

            const new_bot_document = {
                bot_username: bot_information.bot_username,
                bot_password: bot_information.bot_password,
                bot_email: bot_information.bot_email,
                bot_id: bot_information.bot_id,
                discord_data_id: discord_server_data_id,
                ftp_data_id: ftp_server_data_id,
                bot_packages: bot_packages.packages
            };

            await bot_collection.updateOne(
                { bot_id: bot_information.bot_id },
                { $setOnInsert: new_bot_document },
                { upsert: true}
            );
        } catch (error) {
            console.error(`There was an error when attempting to create a Disord bot document in the database. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    public async createBotDiscordData(bot_id: string, discord_server_data: any): Promise<void> {
        const database_connection = await database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');

            const new_discord_data_document = {
                bot_id: bot_id,
                scum_ingame_chat_channel_id: discord_server_data.scum_ingame_chat_channel_id,
                scum_ingame_logins_channel_id: discord_server_data.scum_ingame_logins_channel_id,
                scum_ingame_admin_command_usage_channel_id: discord_server_data.scum_ingame_admin_command_usage_channel,
                scum_new_player_joins_channel_id: discord_server_data.scum_new_player_joins_channel_id,
                scum_server_info_channel_id: discord_server_data.scum_server_info_channel_id
            };

            await bot_collection.updateOne(
                { bot_id: bot_id },
                { $setOnInsert: new_discord_data_document },
                { upsert: true }
            );
        } catch (error) {
            console.error(`There was an error when attempting to insert Discord channel id(s) into the bot. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }
    
    public async createBotFtpServerData(bot_id: string, ftp_server_data: any): Promise<void> {
        const database_connection = await database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');

            const new_ftp_server_data_document = {
                bot_id: bot_id,
                ftp_server_ip: ftp_server_data.server_hostname,
                ftp_server_port: ftp_server_data.ftp_server_port,
                ftp_server_username: ftp_server_data.ftp_server_username,
                ftp_server_password: ftp_server_data.ftp_server_password
            };

            await bot_collection.updateOne(
                { bot_id: bot_id },
                { $setOnInsert: new_ftp_server_data_document },
                { upsert: true }
            );
        } catch (error) {
            console.error(`There was an error when attempting to insert FTP server data into the discord bot. Please contact the server administrator and inform them of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }

    public async createBotItemPackage(bot_id: string, bot_package: any): Promise<void> {
        const database_connection = await database_connection_manager.getConnection();
        try {
            const bot_collection = database_connection.collection('bot');

            const new_bot_item_package_document = {
                bot_id: bot_id,
                package_name: bot_package.package_name,
                package_description: bot_package.package_description,
                package_cost: bot_package.package_cost,
                package_items: bot_package.package_items
            };

            await bot_collection.updateOne(
                { bot_id: bot_id },
                { $setOnInsert: new_bot_item_package_document },
                { upsert: true }
            );
        } catch (error) {
            console.error(`There was an error when attempting to create a new bot item package. Please inform the server administrator of this error: ${error}`);
            throw error;
        } finally {
            await this.releaseConnectionSafely(database_connection);
        }
    }
    
    private async releaseConnectionSafely(database_connection: any): Promise<void> {
        if (database_connection) {
            try {
                await database_connection_manager.releaseConnection(database_connection);
            } catch (error) {
                console.error('An error has occurred during the execution of releaseConnectionSafely function: ', error);
                throw error;
            }
        }
    }
}
