import { ChannelType, SlashCommandBuilder, ThreadAutoArchiveDuration } from 'discord.js';
import StudentRepository from '../database/StudentRepository';
import Cache from '../utils/Cache';

export default function() {
    const create_private_thread_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-thread')
        .setDescription('Use this command to create a private thread for yourself.')
        .addStringOption(options =>
            options.setName('username')
            .setDescription('(Required) your username')
            .setRequired(true))
        .addStringOption(options => 
            options.setName('password')    
            .setDescription('(Required) your password')
            .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Required) The first user for the thread')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const student_repository: StudentRepository = new StudentRepository();
            const discord_user_username: string = interaction.user.username;
            const channel_to_create_thread = interaction.channel;
            const student_cache: Cache = Cache.getCacheInstance();

            let existing_student = student_cache.get(discord_user_username);

            if (!existing_student) {
                existing_student = await student_repository.findByDiscordUsername(discord_user_username);

                if (existing_student) {
                    student_cache.set(discord_user_username, existing_student);
                } else {
                    interaction.reply({content:`Please contact the server administrator and ask to have an account created for you`,ephemeral:true});
                    return;
                }
            }

            const private_text_thread = await channel_to_create_thread.threads.create({
                name: `Private thread for ${discord_user_username}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                type: ChannelType.PrivateThread,
                reason: `Private thread for ${discord_user_username}`
            });
            interaction.reply({content:`The private thread ${private_text_thread} has been created for you`,ephemeral:true});

            if (private_text_thread) {
                student_cache.set(discord_user_username+`Logged in`, true);
            }
        }
    }
    return create_private_thread_object;
}