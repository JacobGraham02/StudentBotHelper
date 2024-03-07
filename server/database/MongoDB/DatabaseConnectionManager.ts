import { MongoClient, ServerApiVersion } from 'mongodb';
import { createPool, Factory } from 'generic-pool';
require('dotenv').config({ path: '../.env' });

export default class DatabaseConnectionManager {
    private database_url: string = process.env.mongodb_connection_string || '';
    private database_connection_pool_size: number = 10;
    private database_name: string = process.env.mongodb_database_connection_name || '';
    private pool: any = null;

    constructor() {
        this.initializeDatabaseConnectionPool();
    }

    private async initializeDatabaseConnectionPool(): Promise<void> {
        const poolFactory: Factory<Promise<any>> = {
            create: async (): Promise<any> => {
                const client = new MongoClient(this.database_url, {
                    serverApi: {
                        version: ServerApiVersion.v1,
                        strict: true,
                        deprecationErrors: true,
                    }
                });
                await client.connect();
                return client.db(this.database_name);
            },
            destroy: async (database_instance: any) => {
                await database_instance.close();
            },
        };
        this.pool = createPool(poolFactory, { max: this.database_connection_pool_size });
    }

    public async getConnection(): Promise<any> {
        if (!this.pool) {
            await this.initializeDatabaseConnectionPool();
        }
        return this.pool.acquire();
    }

    public async releaseConnection(connection: any): Promise<void> {
        this.pool.release(connection);
    }
}
