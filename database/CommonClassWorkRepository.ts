import { UUID } from "crypto";
import CommonClassWork from "../entity/CommonClassWork";
import DatabaseConnectionManager from "./DatabaseConnectionManager";
import { ICommonClassWorkRepository } from "./ICommonClassWorkRepository";
import IDatabaseConfig from "./IDatabaseConfig";

export default class CommonClassWorkRepository implements ICommonClassWorkRepository {
    database_manager: DatabaseConnectionManager;
    database_config: IDatabaseConfig;

    constructor() {
        this.database_config = {
            admin_username: process.env.mysql_server_admin_username!,
            admin_password: process.env.mysql_server_admin_password!,
            host_uri: process.env.mysql_server_admin_hostname!,
            name: process.env.mysql_server_admin_database_name!,
            port: process.env.mysql_server_admin_connection_port!,
            ssl_certificate_path: process.env.mysql_server_admin_path_to_ssl_certificate!
        }
        this.database_manager = new DatabaseConnectionManager(this.database_config);
    }

    async findAll(): Promise<CommonClassWork[] | undefined> {
        const query_string = `SELECT * FROM common_class_work LIMIT 10`;
        const database_connection = await this.database_manager.getConnection();
        const common_class_array: CommonClassWork[] = [];
      
        try {
          const [results] = await database_connection.query(query_string);
      
          if (Array.isArray(results) && results.length > 0) {
            results.forEach((common_class_data: any) => {
              const common_class = new CommonClassWork(
                common_class_data.id,
                common_class_data.class_id,
                common_class_data.class_work_name,
                common_class_data.class_work_end_date,
                common_class_data.class_work_notes
              );
              common_class_array.push(common_class);
            });
      
            return common_class_array;
          } else {
            console.log('No results found');
            return undefined;
          }
        } catch (error) {
          console.error(`There was an error when attempting to fetch all CommonClassWork objects from the database: ${error}`);
          return undefined;
        } finally {
          if (database_connection) {
            database_connection.end();
          }
        }
    }

    async findById(id: UUID): Promise<CommonClassWork | undefined> {
        const query_string: string = `SELECT * FROM common_class_work WHERE id = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [results] = await database_connection.query(query_string, [id]);
            if (results) {
                const common_class_data = results[0];
                return new CommonClassWork(
                    common_class_data.id,
                    common_class_data.class_id,
                    common_class_data.class_work_name,
                    common_class_data.class_work_end_date,
                    common_class_data.class_notes
                );
            }
        } catch (error) {
            console.error(`There was an error when attempting to find a CommonClassWork in the database via id: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async findByClassId(class_id: UUID): Promise<CommonClassWork[] | undefined> {
        const query_string: string = `SELECT * FROM common_class_work WHERE class_id = ?`;
        const database_connection = await this.database_manager.getConnection();
        const class_work_for_class: CommonClassWork[] = [];

        try {
            const [results] = await database_connection.query(query_string, [class_id]);
            if (Array.isArray(results) && results.length > 0) {
                results.forEach((common_class_work: any) => {
                    const common_class_work_document = new CommonClassWork(
                        common_class_work.id,
                        common_class_work.class_id,
                        common_class_work.class_work_name,
                        common_class_work.class_work_end_date,
                        common_class_work.class_work_notes
                    );
                    class_work_for_class.push(common_class_work_document);
                });
            }
            return class_work_for_class;
        } catch (error) {
            console.error(`There was an error when attempting to find a CommonClassWork in the database via id: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async findByHomeworkName(homework_name: string): Promise<CommonClassWork[] | undefined> {
        const query_string: string = `SELECT * FROM common_class_work WHERE class_work_name = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();
        const class_work_for_class: CommonClassWork[] = [];

        try {
            const [results] = await database_connection.query(query_string, [homework_name]);
            if (Array.isArray(results) && results.length > 0) {
                results.forEach((common_class_work: any) => {
                    const common_class_work_document = new CommonClassWork(
                        common_class_work.id,
                        common_class_work.class_id,
                        common_class_work.class_work_name,
                        common_class_work.class_work_end_date,
                        common_class_work.class_work_notes
                    );
                    class_work_for_class.push(common_class_work_document);
                });
            }
        } catch (error) {
            console.error(`There was an error when attempting to find a CommonClassWork in the database via id: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async create(common_class_work: CommonClassWork): Promise<any> {
        const query_string: string = `INSERT INTO common_class_work (id, class_id, class_work_name, class_work_end_date, class_work_notes) VALUES (?, ?, ?, ?, ?)`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const common_class_info = common_class_work.commonClassWorkInformation();
            await database_connection.query(query_string, [
                common_class_info.id,
                common_class_info.class_id,
                common_class_info.homework_name,
                common_class_info.homework_due_date,
                common_class_info.homework_notes
            ]);
        } catch (error) {
            console.error(`There was an error when attempting to insert a CommonClassWork into the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async update(common_class_work: CommonClassWork): Promise<CommonClassWork | undefined> {
        const common_class_info = common_class_work.commonClassWorkInformation();
        const query_string = `UPDATE common_class_work SET class_work_name = ?, class_work_end_date = ?, class_work_notes = ? WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            await database_connection.query(query_string, [
                common_class_info.id,
                common_class_info.class_id,
                common_class_info.homework_name,
                common_class_info.homework_due_date,
                common_class_info.homework_notes
            ]);
            return common_class_work;
        } catch (error) {
            console.error(`An error occurred when attempting to update a CommonClassWork in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async delete(id: number): Promise<any | undefined> {
        const query_string = `DELETE FROM common_class_work WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [rows] = await database_connection.query(query_string, [id]);
            return rows;
        } catch (error) {
            console.error(`There was an error when attempting to delete a CommonClassWork in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }
    
}