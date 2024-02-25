import { SlashCommandBuilder } from 'discord.js';
import Cache from '../utils/Cache';
import StudentRepository from '../database/StudentRepository';
import { UUID } from 'crypto';

export default function() {
    const delete_new_user_object: Object = {
        data: new SlashCommandBuilder()
            .setName('delete-website-user')
            .setDescription('Use this command to delete the user associated with your discord name')
            .addStringOption(options =>
                options.setName('username')
                .setDescription('(Required) user username')
                .setRequired(true)
            ),
            
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const student_cache: Cache = Cache.getCacheInstance();
            const student_repository: StudentRepository = new StudentRepository();
            const discord_user_username: string = interaction.user.username;

            let existing_student = student_cache.get(discord_user_username);
            if (existing_student) {
                interaction.reply({content:`The username that you have entered is not associated with any known user. Please contact the server administrator and have them create an account for you`,ephemeral:true});
                return;
            }

            let existing_user = await student_repository.findByDiscordUsername(discord_user_username);
            if (!existing_user) {
                interaction.reply({content:'The username that you have entered is not associated with any known user. Please contact the server administrator and have them create an account for you',ephemeral:true});
                student_cache.set(discord_user_username, 'The username that you have entered is not associated with any known user. Please contact the server administrator and have them create an account for you');
                return;
            }

            try {
                const existing_user_uuid: UUID = existing_user.studentInformation().studentId;
                await student_repository.delete(existing_user_uuid);
                student_cache.clear(discord_user_username);
                await interaction.reply({content:`The specified account has been deleted`,ephemeral:true});
            } catch (error) {
                await interaction.reply({content:`There was an error when attempting to delete the specified user account: ${error}`,emphemeral:true});
                throw error;
            }
        }
    }
    return delete_new_user_object;
}