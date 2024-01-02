import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({ path: './.env' });
import { UUID, randomUUID } from "crypto";
import CommonClass from "../entity/CommonClass";
import { ICommonClassRepository } from "./ICommonClassRepository";
import DatabaseConnectionManager from "./DatabaseConnectionManager";
import IDatabaseConfig from "./IDatabaseConfig";

export default class CommonClassRepository implements ICommonClassRepository {
    database_manager: DatabaseConnectionManager;
    database_config: IDatabaseConfig;

    constructor() {
        this.database_config = {
            admin_username: process.env.mysql_server_admin_username!,
            admin_password: process.env.mysql_server_admin_password!,
            host_uri: process.env.mysql_server_admin_hostname!,
            name: process.env.mysql_server_admin_database_name!,
            port: process.env.mysql_server_admin_connection_port!,
            ssl_certificate_path: '../' + process.env.mysql_server_admin_path_to_ssl_certificate!
        }
        this.database_manager = new DatabaseConnectionManager(this.database_config);
    }

    async findAll(): Promise<CommonClass[] | undefined> {
        const query_string = `SELECT * FROM common_class LIMIT 10`;
        const database_connection = await this.database_manager.getConnection();
        const common_class_array: CommonClass[] = [];
      
        try {
          const [results] = await database_connection.query(query_string);
      
          if (Array.isArray(results) && results.length > 0) {
            results.forEach((common_class_data: any) => {
              const common_class = new CommonClass(
                common_class_data.id,
                common_class_data.class_start_time,
                common_class_data.class_end_time,
                common_class_data.class_course_code,
                common_class_data.class_name
              );
              common_class_array.push(common_class);
            });
      
            return common_class_array;
          } else {
            console.log('No results found');
            return undefined;
          }
        } catch (error) {
          console.error(`There was an error when attempting to fetch all CommonClass objects from the database: ${error}`);
          return undefined;
        } finally {
          if (database_connection) {
            database_connection.end();
          }
        }
    }
      

    async findById(id: UUID): Promise<CommonClass | undefined> {
        const query_string: string = `SELECT * FROM common_class WHERE id = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [results] = await database_connection.query(query_string, [id]);
            if (results[0]) {
                const common_class_data = results[0];
                return new CommonClass(
                    common_class_data.id,
                    common_class_data.class_start_time,
                    common_class_data.class_end_time,
                    common_class_data.class_course_code,
                    common_class_data.class_name
                );
            }
        } catch (error) {
            console.error(`There was an error when attempting to find a CommonClass in the database via id: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async findByClassName(class_name: string): Promise<CommonClass | undefined> {
        const query_string: string = `SELECT * FROM common_class WHERE class_name = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [results] = await database_connection.query(query_string, [class_name]);
            if (results[0]) {
                const common_class_data = results[0];
                return new CommonClass(
                    common_class_data.id,
                    common_class_data.class_start_time,
                    common_class_data.class_end_time,
                    common_class_data.class_course_code,
                    common_class_data.class_name
                );
            }
        } catch (error) {
            console.error(`There was an error when attempting to find a CommonClass in the database via id: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async create(common_class: CommonClass): Promise<any> {
        const query_string: string = `INSERT INTO common_class (id, class_start_time, class_end_time, class_course_code, class_name) VALUES (?, ?, ?, ?, ?)`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const common_class_info = common_class.commonClassInformation();
            await database_connection.query(query_string, [
                common_class_info.class_id,
                common_class_info.class_start_time,
                common_class_info.class_end_time,
                common_class_info.class_course_code,
                common_class_info.class_name
            ]);
        } catch (error) {
            console.error(`There was an error when attempting to insert a CommonClass into the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async update(common_class: CommonClass): Promise<CommonClass | undefined> {
        const common_class_info = common_class.commonClassInformation();
        const query_string = `UPDATE common_class SET class_name = ?, class_start_time = ?, class_end_time = ?, class_course_code = ? WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            await database_connection.query(query_string, [
                common_class_info.class_id,
                common_class_info.class_start_time,
                common_class_info.class_end_time,
                common_class_info.class_course_code,
                common_class_info.class_name
            ]);
            return common_class;
        } catch (error) {
            console.error(`An error occurred when attempting to update a CommonClass in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }
    
    async delete(id: number): Promise<any | undefined> {
        const query_string = `DELETE FROM common_class WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [rows] = await database_connection.query(query_string, [id]);
            return rows;
        } catch (error) {
            console.error(`There was an error when attempting to delete a CommonClass in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }
}
