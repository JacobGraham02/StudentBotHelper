import { PoolConnection } from "mysql2/promise";
import fs from 'fs';
import IDatabaseConfig from "../../../database/MySQL/IDatabaseConfig";
import DatabaseConnectionManager from "../../../database/MySQL/DatabaseConnectionManager";

jest.useRealTimers();

describe('DatabaseConnectionManager Integration Test', () => {

    let database_ssl_certificate: Object;
    let database_connection_manager: DatabaseConnectionManager;
    let database_connection;
    let database_config: IDatabaseConfig;

    beforeAll(async () => {
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            database_ssl_certificate = {ca: fs.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate)}
        }
        database_config = {
            admin_username: process.env.mysql_server_admin_username!,
            admin_password: process.env.mysql_server_admin_password!,
            host_uri: process.env.mysql_server_admin_hostname!,
            name: process.env.mysql_server_admin_database_name!,
            port: process.env.mysql_server_admin_connection_port!,
            ssl_certificate_path: process.env.mysql_server_admin_path_to_ssl_certificate!
        }
        database_connection_manager = new DatabaseConnectionManager(database_config);
        await database_connection_manager.initializeDatabaseConnectionPool();
        database_connection = await database_connection_manager.getConnection();
    });

    it('should connect to the remote MySQL database on Microsoft Azure', async() => {
        expect(database_connection).toBeDefined();
    });

    it('should perform a query on the remote MySQL database on Microsoft Azure', async() => {     
        try {
            const [rows, fields] = await database_connection.query('SELECT 1+1 AS result');
            expect(rows[0].result).toEqual(2);
        } catch (error) {
            console.error(error);
        }
    });

    afterAll(async() => {
        database_connection.release();
        await database_connection_manager.closePool();
    })
})