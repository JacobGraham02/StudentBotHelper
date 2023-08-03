"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionManager = void 0;
require('dotenv').config({ path: './.env' });
const mysql2_1 = __importDefault(require("mysql2"));
const fs_1 = __importDefault(require("fs"));
class DatabaseConnectionManager {
    constructor() {
        this.database_connection_limit = 10;
        this.database_admin_username = process.env.mysql_server_admin_username;
        this.database_admin_password = process.env.mysql_server_admin_password;
        this.database_host_uri = process.env.mysql_server_admin_hostname;
        this.database_name = process.env.mysql_server_admin_database_name;
        this.database_port = process.env.mysql_server_admin_connection_port;
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            this.database_ssl_certificate = { ca: fs_1.default.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate) };
        }
        else {
            throw new Error('The database SSL certificate is undefined');
        }
    }
    /*
    We use the double !! operator to negate the result of a single ! operator. Any returned value is coerced into a boolean value
    */
    checkDatabaseConfigurationValues() {
        return !!(this.database_admin_username && this.database_admin_password && this.database_host_uri
            && this.database_name && this.database_port && this.database_ssl_certificate);
    }
    initializeDatabaseConnectionPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.checkDatabaseConfigurationValues()) {
                this.database_connection_pool = mysql2_1.default.createPool({
                    connectionLimit: this.database_connection_limit,
                    host: this.database_host_uri,
                    port: Number(this.database_port),
                    user: this.database_admin_username,
                    password: this.database_admin_password,
                    database: this.database_name,
                    ssl: this.database_ssl_certificate
                });
                this.database_connection_pool.on('connection', function (connection) {
                    console.log(`Database connection established: ${connection}`);
                });
                this.database_connection_pool.on('error', function (error) {
                    console.error(`Database connection error: ${error}`);
                });
            }
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.database_connection_pool) {
                yield this.initializeDatabaseConnectionPool();
            }
            return new Promise((resolve, reject) => {
                this.database_connection_pool.getConnection((error, connection) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(connection);
                    }
                });
            });
        });
    }
    closePool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.database_connection_pool) {
                return new Promise((resolve, reject) => {
                    this.database_connection_pool.end(function (error) {
                        if (error) {
                            reject(`There was an error when attempting to close the database connection pool ${error}`);
                            return;
                        }
                        resolve(`The database connection pool has successfully closed`);
                    });
                });
            }
            ;
        });
    }
}
exports.DatabaseConnectionManager = DatabaseConnectionManager;
