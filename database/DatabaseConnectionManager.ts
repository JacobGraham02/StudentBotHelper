import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: './.env'});
import IDatabaseConfig from "./IDatabaseConfig";
import mysql from 'mysql2/promise';
import fs from 'fs';

export default class DatabaseConnectionManager {
    private database_connection_limit: number = 10;
    private database_config: IDatabaseConfig;  
    private database_ssl_certificate: { ca: Buffer };
    private database_connection_pool!: mysql.Pool;

    constructor(config: IDatabaseConfig) {
        this.database_config = config;

        if (this.database_config.ssl_certificate_path) {
            this.database_ssl_certificate = {ca: fs.readFileSync(this.database_config.ssl_certificate_path)};
        } else {
            throw new Error('The database SSL certificate path is not provided');
        }
    }

    private isValidConfig(): boolean {
        return !!(this.database_config.admin_username && this.database_config.admin_password && this.database_config.host_uri 
            && this.database_config.name && this.database_config.port && this.database_ssl_certificate);
    }

    async initializeDatabaseConnectionPool() {
        if (!this.isValidConfig) {
            throw new Error('Invalid database configuration');
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
            console.log(`Database connection established: ${connection.threadId}`);
        });

        this.database_connection_pool.on('release', (connection) => {
            console.log(`Database connection ${connection.threadId} has been released`);
        });
    }
    
    async getConnection(): Promise<mysql.PoolConnection> {
        if (!this.database_connection_pool) {
            await this.initializeDatabaseConnectionPool();
        }
        try {
            return await this.database_connection_pool.getConnection();
        } catch (error) {
            console.error(`We failed to get a database connection:${error}`);
            throw error;
        }
    }

    async closePool() {
        if (this.database_connection_pool) {
            console.log('Close pool function');
            await this.database_connection_pool.end();
        }
    }
}