import { SlashCommandBuilder, User } from 'discord.js';
import { randomUUID } from 'crypto';
import StudentRepository from '../database/StudentRepository';
import Student from '../entity/Student';
import { hashPassword } from '../modules/hashAndValidatePassword';

export default function() {
    const create_new_user_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-user')
            .setDescription('Use this command to create a new user for yourself')
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
            const student_repository = new StudentRepository();
            const discord_user_username: string = interaction.user.username;
            console.log(`Discord user username is:${discord_user_username}`);

            const existing_student_result = await student_repository.findByDiscordUsername(discord_user_username);
            if (existing_student_result !== undefined) {
                await interaction.reply({content:`You have already created a user for this server. Please attempt to log in or reset your credentials`});
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
            
            await student_repository.create(student_for_database);
            interaction.reply({content:`An account has been created for you. Remember to save your login credentials somewhere safe`,ephemeral: true});
        }
    }
    return create_new_user_object;
}