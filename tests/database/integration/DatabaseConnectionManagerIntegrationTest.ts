import { PoolConnection } from "mysql2";
import { DatabaseConnectionManager } from "../../../database/DatabaseConnectionManager";
import fs from 'fs';

jest.useRealTimers();

describe('DatabaseConnectionManager Integration Test', () => {

    let database_ssl_certificate: Object;
    let database_connection_manager: DatabaseConnectionManager;
    let database_connection: PoolConnection;

    beforeAll(async () => {
        database_connection_manager = new DatabaseConnectionManager();
        database_connection = await database_connection_manager.getConnection();
        if (process.env.mysql_server_admin_path_to_ssl_certificate) {
            database_ssl_certificate = {ca: fs.readFileSync(process.env.mysql_server_admin_path_to_ssl_certificate)}
        }
    });

    it('should connect to the remote MySQL database on Microsoft Azure', async() => {
        expect(database_connection).toBeDefined();
    });

    it('should perform a query on the remote MySQL database on Microsoft Azure', async() => {        
        new Promise((resolve, reject) => {
            database_connection.query('SELECT 1 + 1 AS result', (error, results, fields) => {
                if (error) {
                    reject(error);
                } 
                expect(results[0].result).toEqual(2);
                resolve(results[0].result);
            });
        }).catch((error) => {
            console.error(`There was an error when attempting to perform the query 1+1 using the database: ${error}`);
        });
    });

    afterAll(async() => {
        database_connection.release();
        await database_connection_manager.closePool();
    })
})