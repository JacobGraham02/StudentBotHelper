import { UUID } from 'crypto';
import Student from '../entity/Student';

/**
 * An interface containing all of the basic CRUD functions which you would expect for an entity class that represents a user
 * findById(id: UUID): Promise<User | undefined>
 * findByUsername(username: string): Promise<User | undefined>
 * create(user: User): Promise<User | undefined>
 * update(user: User): Promise<User | undefined>
 * delete(id: UUID): Promise<User | undefined>
 */
export interface IStudentRepository {
    findAll(): Promise<Student[] | undefined>
    findById(id: UUID): Promise<Student | undefined>
    findByStudentName(username: string): Promise<Student | undefined>
    findByDiscordUsername(username: string): Promise<Student | undefined>
    create(user: Student): Promise<any>
    update(user: Student): Promise<Student | undefined>
    delete(id: UUID): Promise<Student | undefined>
}