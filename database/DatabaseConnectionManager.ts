import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: './.env'});
import mysql from 'mysql2';
import fs from 'fs';

export class DatabaseConnectionManager {

    database_connection_limit: number = 10;
    database_admin_username: string | undefined = process.env.mysql_server_admin_username;
    database_admin_password: string | undefined = process.env.mysql_server_admin_password;
    database_host_uri: string | undefined = process.env.mysql_server_admin_hostname;
    database_name: string | undefined = process.env.mysql_server_admin_database_name;
    database_port: string | undefined = process.env.mysql_server_admin_connection_port;
    database_ssl_certificate: Object;
    database_connection_pool;

    constructor() {
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            this.database_ssl_certificate = {ca: fs.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate)};
        } else {
            throw new Error('The database SSL certificate is undefined');
        }
    }
    
    /*
    We use the double !! operator to negate the result of a single ! operator. Any returned value is coerced into a boolean value
    */
    checkDatabaseConfigurationValues():boolean {
        return !!(this.database_admin_username && this.database_admin_password && this.database_host_uri 
            && this.database_name && this.database_port && this.database_ssl_certificate);
    }

    async initializeDatabaseConnectionPool() {
        if (this.checkDatabaseConfigurationValues()) {
            this.database_connection_pool = mysql.createPool({
                connectionLimit: this.database_connection_limit,
                host: this.database_host_uri,
                port: Number(this.database_port),
                user: this.database_admin_username,
                password: this.database_admin_password,
                database: this.database_name,
                ssl: this.database_ssl_certificate
            });

            /*this.database_connection_pool.on('connection', function(connection) {
                console.log(`Database connection established: ${connection}`);
            });

            this.database_connection_pool.on('error', function(error) {
                console.error(`Database connection error: ${error}`);
            });

            this.database_connection_pool.on('release', function(connection) {
                console.log(`The database connection ${connection} has been released`);
            });
            */
        }
    }

    async getConnection(): Promise<mysql.PoolConnection> {
        if (!this.database_connection_pool) {
            await this.initializeDatabaseConnectionPool();
        }
        return new Promise((resolve, reject) => {
            this.database_connection_pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    async closePool() {
        if (this.database_connection_pool) {
            return new Promise((resolve, reject) => {
                this.database_connection_pool.end(function(error) {
                    if (error) {
                        reject(`There was an error when attempting to close the database connection pool ${error}`);
                        return;
                    }
                    resolve(`The database connection pool has successfully closed`);
                });
            });
        };
    }
}