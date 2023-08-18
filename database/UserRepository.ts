import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: './.env'});
import { UUID } from "crypto";
import User from "../entity/User";
import { IUserRepository } from "./IUserRepository";
import { hashPassword } from "../modules/hashAndValidatePassword";
import DatabaseConnectionManager from "./DatabaseConnectionManager";
import IDatabaseConfig from "./IDatabaseConfig";


export default class UserRepository implements IUserRepository {
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
    
    /**
     * Find all users from the 'student' table. There is a limit of 10 fetched users so I save costs on fetching data from the database I host on Microsoft Azure.
     * @returns A Promise containing an array of User objects, or a value of undefined if an array of User objects cannot be fetched
     */
    async findAll(): Promise<any> {
        const query_string = `SELECT * FROM student LIMIT 10`;
        const database_connection = await this.database_manager.getConnection();
        const student_array: User[] = [];

        try {
            const [results] = await database_connection.query(query_string);
            results[0].forEach((student: any) => {
                const user = new User(
                    student.id,
                    student.username,
                    student.password,
                    student.home_location,
                    student.school_location
                );
                student_array.push(user);
            });
            return student_array.length > 0 ? student_array : undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

     /**
      * Use prepared queries to find a specific user from the database. If no user is found, the value 'undefined' is returned.
      * Because every id must be unique, the sql query is limited to returning 1 record. 
      * @param id The UUID id of the user we want to fetch from the database
      * @returns A database entry containing all of the information for a specific user, or 'undefined' if a specific user cannot be found. 
      */
    async findById(id: UUID): Promise<User | undefined> {
        const query_string: string = `SELECT * FROM student WHERE id = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [results] = await database_connection.query(query_string, [id]);
            if (results[0]) {
                const user_data = results[0];
                return new User(
                    user_data.id,
                    user_data.username,
                    user_data.password,
                    user_data.home_location,
                    user_data.school_location
                );
            }
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

     /**
      * Returns a Promise containing a single user from the database depending on the supplied username. If no user is found, the value 'undefined' is returned
      * @param username a string containing the username we wish to search for in the database
      * @returns Promise<User | undefined>
      */
    async findByUsername(username: string): Promise<User | undefined> {
         const query_string: string = `SELECT * FROM student AS student WHERE username = ? LIMIT 1`;
         if (!this.database_manager) {
            console.error('The database manager object is undefined or null');
         }
         const database_connection = await this.database_manager.getConnection();

        try {
            const [rows, fields] = await database_connection.query(query_string, [username]);
            if (rows[0].id && rows[0].username && rows[0].password && rows[0].salt && rows[0].home_location && rows[0].school_location) {
                const userFoundFromDatabase: User = new User(rows[0].id, rows[0].username, rows[0].password, rows[0].salt, rows[0].home_location, rows[0].school_location,);
                return userFoundFromDatabase;
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(`There was an error when attempting to fetch a User by their username: ${error}`);
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined; 
    }

    async create(user: User): Promise<any> {
        const query_string: string = `INSERT INTO student (id, username, password, home_location, school_location, salt) VALUES (?, ?, ?, ?, ?, ?)`;
        if (!this.database_manager) {
            console.error('The database manager object is undefined or null');
        }
        const database_connection = await this.database_manager.getConnection();
        try {
            const user_information = user.userInformation();
            const user_password_object = hashPassword(user_information.userPassword);
            const [rows, fields]= await database_connection.query(query_string,
                [user_information.userId,
                user_information.userUsername,
                user_information.userPassword,
                user_information.userStartLocation,
                user_information.userSchoolLocation,
                user_password_object.salt]);
            return rows;
        } catch (error) {
            console.error(error);
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async update(user: User): Promise<User | undefined> {
        const user_object_values: any[] = [];
        const user_object_update_sql_queries: string[] = [];
        const user_data = user.userInformation();

        if (user_data.userUsername) {
            user_object_values.push(user_data.userUsername);
            user_object_update_sql_queries.push('username = ?');
        }
        if (user_data.userPassword) {
            user_object_values.push(user_data.userPassword);
            user_object_update_sql_queries.push('password = ?');
        }
        if (user_data.userStartLocation) {
            user_object_values.push(user_data.userStartLocation);
            user_object_update_sql_queries.push('home_location = ?');
        }
        if (user_data.userSchoolLocation) {
            user_object_values.push(user_data.userSchoolLocation);
            user_object_update_sql_queries.push('school_location = ?');
        }

        const query_string = `UPDATE student SET ${user_object_update_sql_queries.join(', ')} WHERE id = ?`;
        user_object_values.push(user_data.userId);
        
        const database_connection = await this.database_manager.getConnection();
        try {
            console.log(user_object_values);
            await database_connection.query(query_string, user_object_values);
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

    async delete(id: UUID): Promise<User | undefined> {
        const query_string = `DELETE FROM student WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            await database_connection.query(query_string, [id]);
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }
}