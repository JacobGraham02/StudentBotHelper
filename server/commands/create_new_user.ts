import { SlashCommandBuilder, User } from 'discord.js';
import { randomUUID } from 'crypto';
import StudentRepository from '../database/StudentRepository';
import Student from '../entity/Student';
import { hashPassword } from '../modules/hashAndValidatePassword';
import Cache from '../utils/Cache';

export default function() {
    const create_new_user_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-website-user')
            .setDescription('Use this command to create a new user that will allow a user to log in to the website')
            .addStringOption(options =>
                options.setName('username')
                .setDescription('(Required) your username')
                .setRequired(true))
            .addStringOption(options =>
                options.setName('password')
                .setDescription('(Required) your password')
                .setRequired(true)
            ),
            
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const student_cache: Cache = Cache.getCacheInstance();
            const student_repository: StudentRepository = new StudentRepository();
            const discord_user_username: string = interaction.user.username;

            let existing_student = student_cache.get(discord_user_username);
            
            if (!existing_student) {
                existing_student = await student_repository.findByDiscordUsername(discord_user_username);
                
                if (existing_student) {
                    student_cache.set(discord_user_username, existing_student);
                }
            }
            if (existing_student !== undefined) {
                await interaction.reply({content:`You have already created a user for this server. Please attempt to log in or reset your credentials`,ephemeral:true});
                return;
            } 
            const student_submitted_username = interaction.options.getString('username');
            const student_submitted_password = interaction.options.getString('password');
            const student_for_database_password_object = hashPassword(student_submitted_password);
            const student_for_database: Student = new Student(
                randomUUID(), 
                student_submitted_username, 
                student_for_database_password_object.hash,
                discord_user_username,
                student_for_database_password_object.salt,
                undefined,
                undefined);
            
            try {
                await student_repository.create(student_for_database);
                student_cache.clear(discord_user_username);
                await interaction.reply({content:`An account has been created for you. Remember to save your login credentials somewhere safe`,ephemeral: true});
            } catch (error) {
                await interaction.reply({content: `There was an error when attempting to create an account for a user: ${error}`,ephemeral:true});
                throw error;
            }
        }
    }
    return create_new_user_object;
}