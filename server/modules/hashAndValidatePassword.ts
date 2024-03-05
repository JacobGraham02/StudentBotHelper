import crypto, { BinaryLike } from 'crypto';
import IStudentPasswordObject from '../database/MySQL/IStudentPasswordObject';
/**
 * This function takes in a variable with the BinaryLike data type and uses the native npm module 'crypto' to hash and salt the password. 
 * @param password BinaryLike is a string-like data type that is the password we are going to hash 
 * @returns A plain javascript object containing the hash and salt of the supplied password
 */
export function hashPassword(password: BinaryLike): IStudentPasswordObject {
    const hash_creation_iterations: number = 10000;
    const hash_total_length = 60;
    const salt: string = crypto.randomBytes(32).toString('hex');
    const hash: string = crypto.pbkdf2Sync(password, salt, hash_creation_iterations, hash_total_length, 'sha512').toString('hex');
    return {
        hash: hash,
        salt: salt
    };
}

/**
 * This function takes a password with a BinaryLike data type, a password hash with a string data type, and a password salt with a string data type
 * The supplied password hash will be compared with a computed hash 
 * @param password BinaryLike a string-like data type that is the password we are going to hash
 * @param password_hash A string of characters that is the password hash from the database with which we will be comparing the computed hash for equality 
 * @param password_salt A string of characters that is the password salt from the database 
 * @returns A boolean value indicating whether the user supplied password is equal to the password stored in the database
 */
export function validatePassword(password: BinaryLike, password_hash: string, password_salt: string): boolean {
    const hash_creation_iterations: number = 10000;
    const hash_total_length = 60;
    const hash = crypto.pbkdf2Sync(password, password_salt, hash_creation_iterations, hash_total_length, 'sha512').toString('hex');
    return password_hash === hash;
}