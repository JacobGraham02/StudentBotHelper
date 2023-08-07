import { UUID } from 'crypto';
import User from '../entity/User';

interface IUserRepository {
    findById(id: UUID): Promise<User | undefined>
    findByUsername(username: string): Promise<User | undefined>
    create(user: User): Promise<User | undefined>
    update(user: User): Promise<User | undefined>
    delete(id: UUID): Promise<User | undefined>
}