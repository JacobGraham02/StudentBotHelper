import { PoolConnection } from "mysql2/promise";
import fs from 'fs';
import IDatabaseConfig from "../../../database/MySQL/IDatabaseConfig";
import DatabaseConnectionManager from "../../../database/MySQL/DatabaseConnectionManager";
import UserRepository from "../../../database/MySQL/StudentRepository";
import Student from "../../../entity/Student";

describe('DatabaseConnectionManager Integration Test', () => {

    let database_ssl_certificate: Object;
    let database_connection_manager: DatabaseConnectionManager;
    let userRepository: UserRepository;
    let database_config: IDatabaseConfig;
    const user:Student = new Student(
        'eb266e83-bdce-4e04-845b-295ebb09b795',
        'test_username',
        'test_password',
        'test_discord_username',
        'test_salt',
        'test_start_location',
        'test_school_location'
    );

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
        userRepository = new UserRepository();
        
    });

    it('Should insert a new student into the database', async() => {
        const newUserInformation = await userRepository.create(user);
        expect(newUserInformation).toBeDefined();
    });

    it('Should find a student in the database from their username', async() => {
        const foundUser = await userRepository.findByStudentName('test');
        expect(foundUser).toBeDefined();
        const foundUserInformation = foundUser?.studentInformation();
        expect(foundUserInformation?.studentUsername).toBe('test');
    });

    it('Should delete a student from the database', async() => {  
        const deletedUser = await userRepository.delete('eb266e83-bdce-4e04-845b-295ebb09b795');
        expect(deletedUser).toBeUndefined();  
    });

    it('Should update a student in the database', async() => {
        const updated_user:Student = new Student(
            'eb266e83-bdce-4e04-845b-295ebb09b795',
            'updated_test',
            'updated_test',
            'updated_test',
            'updated_test',
            'updated_test'
        );
        await userRepository.update(updated_user);
        const updatedUser = await userRepository.findById('eb266e83-bdce-4e04-845b-295ebb09b795');
        const updatedUserInformation = updatedUser?.studentInformation();
        expect(updatedUserInformation?.studentUsername).toBe('updated_test');
    });

    it('Should find a student in the database from their id', async() => {
        const foundUser = await userRepository.findById('eb266e83-bdce-4e04-845b-295ebb09b795');
        expect(foundUser).toBeDefined();
        const foundUserInformation = foundUser?.studentInformation();
        expect(foundUserInformation?.studentId).toBe('eb266e83-bdce-4e04-845b-295ebb09b795');
    });

    afterAll(async() => {
        database_connection_manager.closePool();
    })
})