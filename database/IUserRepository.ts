import { UUID } from 'crypto';
import User from '../entity/User';

/**
 * An interface containing all of the basic CRUD functions which you would expect for an entity class that represents a user
 * findById(id: UUID): Promise<User | undefined>
 * findByUsername(username: string): Promise<User | undefined>
 * create(user: User): Promise<User | undefined>
 * update(user: User): Promise<User | undefined>
 * delete(id: UUID): Promise<User | undefined>
 */
export interface IUserRepository {
    findAll(): Promise<User[] | undefined>
    findById(id: UUID): Promise<User | undefined>
    findByUsername(username: string): Promise<User | undefined>
    create(user: User): Promise<User | undefined>
    update(user: User): Promise<User | undefined>
    delete(id: UUID): Promise<User | undefined>
}