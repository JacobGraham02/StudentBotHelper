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
const DatabaseConnectionManager_1 = require("../../../database/DatabaseConnectionManager");
const fs_1 = __importDefault(require("fs"));
jest.useRealTimers();
describe('DatabaseConnectionManager Integration Test', () => {
    let database_ssl_certificate;
    let database_connection_manager;
    const database_connection_limit = 10;
    const database_admin_username = process.env.mysql_server_admin_username;
    const database_admin_password = process.env.mysql_server_admin_password;
    const database_host_uri = process.env.mysql_server_admin_hostname;
    const database_name = process.env.mysql_server_admin_database_name;
    const database_port = process.env.mysql_server_admin_connection_port;
    beforeAll(() => {
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            database_ssl_certificate = { ca: fs_1.default.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate) };
        }
    });
    beforeEach(() => {
        database_connection_manager = new DatabaseConnectionManager_1.DatabaseConnectionManager();
    });
    it('should connect to the remote MySQL database on Microsoft Azure', () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_connection_manager.getConnection();
        expect(connection).toBeDefined();
        connection.release();
    }));
    it('should perform a query on the remote MySQL database on Microsoft Azure', () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_connection_manager.getConnection();
        yield new Promise((resolve, reject) => {
            connection.query('SELECT 1 + 1 AS result', (error, results, fields) => {
                if (error) {
                    connection.release();
                    reject(error);
                }
                else {
                    expect(results[0].result).toEqual(2);
                    connection.release();
                    resolve(results[0].result);
                }
            });
        }).catch((error) => {
            console.error(`There was an error when attempting to perform the query 1+1 using the database: ${error}`);
            connection.release();
        }).then(() => {
            console.log('The promise has resolved');
            connection.release();
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_connection_manager.closePool();
    }));
});
