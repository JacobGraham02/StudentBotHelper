import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: './.env'});
import { UUID } from "crypto";
import Student from "../entity/Student";
import { IStudentRepository } from "./IStudentRepository";
import { hashPassword } from "../modules/hashAndValidatePassword";
import DatabaseConnectionManager from "./DatabaseConnectionManager";
import IDatabaseConfig from "./IDatabaseConfig";

export default class StudentRepository implements IStudentRepository {
    database_manager: DatabaseConnectionManager;
    database_config: IDatabaseConfig;

    constructor() {
        this.database_config = {
            admin_username: process.env.mysql_server_admin_username!,
            admin_password: process.env.mysql_server_admin_password!,
            host_uri: process.env.mysql_server_admin_hostname!,
            name: process.env.mysql_server_admin_database_name!,
            port: process.env.mysql_server_admin_connection_port!,
            ssl_certificate_path: '../'+process.env.mysql_server_admin_path_to_ssl_certificate!
        }
        this.database_manager = new DatabaseConnectionManager(this.database_config);
    }

    /**
     * Find all Students from the 'student' table. There is a limit of 10 fetched Students so I save costs on fetching data from the database I host on Microsoft Azure.
     * @returns A Promise containing an array of Student objects, or a value of undefined if an array of Student objects cannot be fetched
     */
    async findAll(): Promise<Student[] | undefined> {
        const query_string = `SELECT * FROM student LIMIT 10`;
        const database_connection = await this.database_manager.getConnection();
        const student_array: Student[] = [];

        try {
            const [results] = await database_connection.query(query_string);
            results[0].forEach((student: Student) => {
                const student_information = student.studentInformation();
                const new_student = new Student(
                    student_information.studentId,
                    student_information.studentUsername,
                    student_information.studentPassword,
                    student_information.studentDiscordUsername,
                    student_information.studentSalt,
                    student_information.studentStartLocation,
                    student_information.studentStartLocation
                );
                student_array.push(new_student);
            });
            return student_array.length > 0 ? student_array : undefined;
        } catch(error) {
            console.error(`There was an error when attempting to fetch all Student objects from the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

     /**
      * Use prepared queries to find a specific Student from the database. If no Student is found, the value 'undefined' is returned.
      * Because every id must be unique, the sql query is limited to returning 1 record. 
      * @param id The UUID id of the Student we want to fetch from the database
      * @returns A database entry containing all of the information for a specific Student, or 'undefined' if a specific Student cannot be found. 
      */
    async findById(id: UUID): Promise<Student | undefined> {
        const query_string: string = `SELECT * FROM student WHERE id = ? LIMIT 1`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [results] = await database_connection.query(query_string, [id]);
            if (results[0]) {
                const student_data = results[0];
                return new Student(
                    student_data.id,
                    student_data.username,
                    student_data.password,
                    student_data.discord_username,
                    student_data.salt,
                    student_data.home_location,
                    student_data.school_location
                );
            }
        } catch(error) {
            console.error(`There was an error when attempting to find a Student in the database via id: ${error}`);
            return undefined;  
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        return undefined;
    }

     /**
      * Returns a Promise containing a single Student from the database depending on the supplied Studentname. If no Student is found, the value 'undefined' is returned
      * @param Studentname a string containing the Studentname we wish to search for in the database
      * @returns Promise<Student | undefined>
      */
    async findByStudentName(student_name: string): Promise<Student | undefined> {
         const query_string: string = `SELECT * FROM student AS student WHERE username = ? LIMIT 1`;
         if (!this.database_manager) {
            console.error('The database manager object is undefined or null');
         }
         const database_connection = await this.database_manager.getConnection();

        try {
            const [rows, fields] = await database_connection.query(query_string, [student_name]);
            if (rows[0].id && rows[0].username && rows[0].password && rows[0].salt && rows[0].home_location && rows[0].school_location) {
                const StudentFoundFromDatabase: Student = new Student(rows[0].id, rows[0].username, rows[0].password, rows[0].salt, rows[0].home_location, rows[0].school_location,);
                return StudentFoundFromDatabase;
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(`There was an error when attempting to fetch a student by their username: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async findByDiscordUsername(discord_username: string): Promise<Student | undefined> {
        const query_string: string = `SELECT * FROM student AS student WHERE discord_username = ? LIMIT 1`;
        if (!this.database_manager) {
           console.error('The database manager object is undefined or null');
        }

        const database_connection = await this.database_manager.getConnection();

        try {
           const [rows, fields] = await database_connection.query(query_string, [discord_username]);

           if (rows[0].id && rows[0].username && rows[0].password && rows[0].discord_username && rows[0].salt) {
               const student: Student = new Student(rows[0].id, rows[0].username, rows[0].password, rows[0].discord_username, 
                rows[0].salt, rows[0].home_location, rows[0].school_location);
               return student;
           } else {
               throw new Error(`A user in the database by that discord name could not be found. Please try again or try different inputs`);
           }
        } catch (error) {
           console.error(`There was an error when attempting to fetch a Student by their discord name: ${error}`);
           return undefined;
        } finally {
           if (database_connection) {
               database_connection.end();
           }
        }
    }

    async create(Student: Student): Promise<any | undefined> {
        const query_string: string = `INSERT INTO student (id, username, password, discord_username, salt, home_location, school_location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        if (!this.database_manager) {
            console.error('The database manager object is undefined or null');
        }
        const database_connection = await this.database_manager.getConnection();
        try {
            const student_information = Student.studentInformation();
            const student_password_object = hashPassword(student_information.studentPassword);
            const [rows, fields]= await database_connection.query(query_string,
                [student_information.studentId,
                student_information.studentUsername,
                student_password_object.hash,
                student_information.studentDiscordUsername,
                student_password_object.salt,
                student_information.studentStartLocation,
                student_information.studentSchoolLocation]);
            return rows;
        } catch (error) {
            console.error(`There was an error when attempting to insert a Student into the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }

    async update(Student: Student): Promise<Student | undefined> {
        const student_object_values: any[] = [];
        const student_object_update_sql_queries: string[] = [];
        const student_data = Student.studentInformation();

        if (student_data.studentUsername) {
            student_object_values.push(student_data.studentUsername);
            student_object_update_sql_queries.push('username = ?');
        }
        if (student_data.studentPassword) {
            student_object_values.push(student_data.studentPassword);
            student_object_update_sql_queries.push('password = ?');
        }

        if (student_data.studentDiscordUsername) {
            student_object_values.push(student_data.studentDiscordUsername);
            student_object_update_sql_queries.push('discord_username = ?');
        }

        if (student_data.studentStartLocation) {
            student_object_values.push(student_data.studentStartLocation);
            student_object_update_sql_queries.push('home_location = ?');
        }

        if (student_data.studentSchoolLocation) {
            student_object_values.push(student_data.studentSchoolLocation);
            student_object_update_sql_queries.push('school_location = ?');
        }

        const query_string = `UPDATE student SET ${student_object_update_sql_queries.join(', ')} WHERE id = ?`;
        student_object_values.push(student_data.studentId);
        
        const database_connection = await this.database_manager.getConnection();
        try {
            await database_connection.query(query_string, student_object_values);
        } catch (error) {
            console.error(`An error occurred when attempting to update a Student in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
        
    }

    async delete(id: UUID): Promise<any | undefined> {
        const query_string = `DELETE FROM student WHERE id = ?`;
        const database_connection = await this.database_manager.getConnection();

        try {
            const [rows] = await database_connection.query(query_string, [id]);
            return rows;
        } catch (error) {
            console.error(`There was an error when attempting to delete a Student in the database: ${error}`);
            return undefined;
        } finally {
            if (database_connection) {
                database_connection.end();
            }
        }
    }
}