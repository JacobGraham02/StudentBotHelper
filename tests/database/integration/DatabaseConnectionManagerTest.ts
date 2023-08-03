import { DatabaseConnectionManager } from "../../../database/DatabaseConnectionManager";
import fs from 'fs';

jest.useRealTimers();

describe('DatabaseConnectionManager Integration Test', () => {

    let database_ssl_certificate: Object;
    let database_connection_manager: DatabaseConnectionManager;
    const database_connection_limit = 10;
    const database_admin_username = process.env.mysql_server_admin_username;
    const database_admin_password = process.env.mysql_server_admin_password;
    const database_host_uri = process.env.mysql_server_admin_hostname;
    const database_name = process.env.mysql_server_admin_database_name;
    const database_port = process.env.mysql_server_admin_connection_port;

    beforeAll(() => {
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            database_ssl_certificate = {ca: fs.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate)}
        }
    });

    beforeEach(() => {
        database_connection_manager = new DatabaseConnectionManager();
    });

    it('should connect to the remote MySQL database on Microsoft Azure', async() => {
        const connection = await database_connection_manager.getConnection();
        expect(connection).toBeDefined();
        connection.release();
    });

    it('should perform a query on the remote MySQL database on Microsoft Azure', async() => {        
        const connection = await database_connection_manager.getConnection();
        new Promise((resolve, reject) => {
            connection.query('SELECT 1 + 1 AS result', (error, results, fields) => {
                if (error) {
                    connection.release();
                    reject(error);
                } else {
                    connection.release();
                    expect(results[0].result).toEqual(2);
                    resolve(results[0].result);
                }
            });
        }).catch((error) => {
            connection.release();
            console.error(`There was an error when attempting to perform the query 1+1 using the database: ${error}`);
        }).then(() => {
            connection.release();
            console.log('The promise has resolved');
        });
        connection.release();
    });

    afterAll(async() => {
        await database_connection_manager.closePool();
    })
})