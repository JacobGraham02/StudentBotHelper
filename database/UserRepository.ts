import { UUID } from "crypto";
import User from "../entity/User";
import { IUserRepository } from "./IUserRepository";
import { DatabaseConnectionManager } from "./DatabaseConnectionManager";
import { PoolConnection, RowDataPacket } from "mysql2";
import { hashPassword } from "../modules/hashAndValidatePassword";

export default class UserRepository implements IUserRepository {
    private database_manager: DatabaseConnectionManager | undefined;

    construtor() {
        this.database_manager = new DatabaseConnectionManager();
    }

    /**
     * Find all users from the 'student' table. There is a limit of 10 fetched users so I save costs on fetching data from the database I host on Microsoft Azure.
     * @returns A Promise containing an array of User objects, or a value of undefined if an array of User objects cannot be fetched
     */
    async findAll(): Promise<User[] | undefined> {
        const query_string = `SELECT * FROM student LIMIT 10`;
        const database_connection = await this.database_manager?.getConnection();
        const student_array: User[] = [];

        try {
            database_connection?.query(query_string, function(error, results: RowDataPacket[]) {
                if (error) {
                    console.error(`There was an error when attempting to find all users from the database: ${error}`);
                }
                if (results) {
                    results.forEach((student) => {
                        const user = new User(
                            student.id,
                            student.username,
                            student.password,
                            student.home_location,
                            student.school_location
                        );
                        student_array.push(user);
                    });
                }
            });
        } finally {
            if (database_connection) {
                database_connection.release();
            }
            if (student_array.length > 0) {
                return student_array;
            } else {
                return undefined;
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
        const query_string: string = `SELECT * FROM student AS student WHERE id = ? LIMIT 1`;
        const database_connection = await this.database_manager?.getConnection();
        
        try {
            database_connection?.query(query_string, [id], function(error, results) {
                if (error) {
                    console.error(`There was an error when attempting to find a user by id from the database: ${error}`);
                }
                if(results[0].student) {
                    const user_data = results[0].student;
                    const user = new User(
                        user_data.id,
                        user_data.username,
                        user_data.password,
                        user_data.home_location,
                        user_data.school_location
                    );
                    return user;
                } 
            });
        } finally {
            if (database_connection) {
                database_connection?.release();
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
        const database_connection = await this.database_manager?.getConnection();

        try {
            database_connection?.query(query_string, [username], function(error, results) {
                if (error) {
                    console.error(`There was an error when attempting to find a user by username from the database: ${error}`);
                }
                if (results[0].student) {
                    const user_data = results[0].student;
                    const user = new User(
                        user_data.id,
                        user_data.username,
                        user_data.password,
                        user_data.home_location,
                        user_data.school_location
                    );
                    return user;
                }
            });
        } finally {
            if (database_connection) {
                database_connection.release();
            }
        }
        return undefined;
    }
    async create(user: User): Promise<User | undefined> {
        const query_string: string = `INSERT INTO student (id, username, password, salt, home_location, school_location) VALUES (?, ?, ?, ?, ?, ?)`;
        const database_connection = await this.database_manager?.getConnection();

        try {
            const user_information = user.userInformation();
            const user_password_object = hashPassword(user_information.userPassword);
            database_connection?.query(query_string, 
                [user_information.userId, user_information.userUsername, user_password_object.hash, user_password_object.salt, 
                    user_information.userHomeLocation, user_information.userSchoolLocation], function(error, results) {
                        if (error) {
                            console.error(`There was an error when attempting to create a user and insert them into the database: ${error}`);
                        }
                        if (results) {
                            return results;
                        }
                    });
        } finally {
            if (database_connection) {
                database_connection.release();
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
        if (user_data.userHomeLocation) {
            user_object_values.push(user_data.userHomeLocation);
            user_object_update_sql_queries.push('home_location = ?');
        }
        if (user_data.userSchoolLocation) {
            user_object_values.push(user_data.userSchoolLocation);
            user_object_update_sql_queries.push('school location = ?');
        }
        const query_string = `UPDATE student SET ${user_object_values.join(', ')} WHERE id = ?`;
        const database_connection = await this.database_manager?.getConnection();

        try {
            database_connection?.query(query_string, [user_data.userId], function (error, results) {
                if (error) {
                    console.error(`There was an error when attempting to update a user in the database: ${error}`);
                }
                if (results) {
                    return results[0];
                }
            });
        } finally {
            if (database_connection) {
                database_connection.release();
            }
        }
        return undefined;
    }
    async delete(id: UUID): Promise<User | undefined> {
        const query_string = `DELETE FROM student WHERE id = ?`;
        const database_connection = await this.database_manager?.getConnection();

        try {
            database_connection?.query(query_string, [id], function(error, results) {
                if (error) {
                    console.error(`There was an error when attempting to delete a user from the database: ${error}`);
                }
                if (results) {
                    return results;
                }
            });
        } finally {
            if (database_connection) {
                database_connection.release();
            }
        }
        return undefined;
    }
}