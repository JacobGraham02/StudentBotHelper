import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: './.env'});
import IDatabaseConfig from "./IDatabaseConfig";
import mysql from 'mysql2/promise';
import fs from 'fs';
import CustomEventEmitter from '../../utils/CustomEventEmitter';

export default class DatabaseConnectionManager {
    private database_connection_limit: number = 10;
    private database_config: IDatabaseConfig;  
    private database_ssl_certificate: { ca: Buffer; } | undefined;
    private database_connection_pool!: mysql.Pool;
    private custom_event_emitter: CustomEventEmitter;

    constructor(config: IDatabaseConfig) {
        this.custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();
        this.database_config = config;

        if (this.database_config.ssl_certificate_path) {
            this.database_ssl_certificate = {ca: fs.readFileSync(this.database_config.ssl_certificate_path)};
        } else {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`The database SSL certificate path is either not provided or is invalid. Please inform the bot developer of this error`, 500);
        }
    }

    private isValidConfig(): boolean {
        return !!(this.database_config.admin_username && this.database_config.admin_password && this.database_config.host_uri 
            && this.database_config.name && this.database_config.port && this.database_ssl_certificate);
    }

    async initializeDatabaseConnectionPool() {
        if (!this.isValidConfig) {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`The database configuration is not valid. Please inform the bot developer of this error`);
        }

        this.database_connection_pool = mysql.createPool({
            connectionLimit: this.database_connection_limit,
            host: this.database_config.host_uri,
            port: Number(this.database_config.port),
            user: this.database_config.admin_username,
            password: this.database_config.admin_password,
            database: this.database_config.name,
            ssl: this.database_ssl_certificate
        });
    
        this.database_connection_pool.on('connection', (connection) => {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`Database connection established with id ${connection.threadId}`, 200);
        });

        this.database_connection_pool.on('release', (connection) => {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`Database connection released with id ${connection.threadId}`, 200);
        });
    }
    
    async getConnection(): Promise<mysql.PoolConnection> {
        if (!this.database_connection_pool) {
            await this.initializeDatabaseConnectionPool();
        }
        try {
            return await this.database_connection_pool.getConnection();
        } catch (error) {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`ERROR - A database connection could not be acquired`, 500);
            throw error;
        }
    }

    async closePool() {
        if (this.database_connection_pool) {
            this.custom_event_emitter.emitDatabaseLoggingMessage(`The database connection pool has been closed`, 200);
            await this.database_connection_pool.end();
        }
    }
}