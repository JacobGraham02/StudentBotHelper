import { ChannelType, SlashCommandBuilder, ThreadAutoArchiveDuration, User } from 'discord.js';
import StudentRepository from '../database/StudentRepository';
import Cache from '../utils/Cache';

export default function() {
    const create_private_thread_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-session')
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
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const category_id = "1110654950066896957"; 
            const thread_owner_user: User = interaction.options.getUser('user');
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
                    interaction.reply({content:`Please register a user account using the command /create-user`,ephemeral:true});
                    return;
                }
            }

            const private_text_thread = await channel_to_create_thread.threads.create({
                name: `Private session for ${discord_user_username}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                type: ChannelType.PrivateThread,
                reason: `This thread is a user session for ${discord_user_username}`
            });
            interaction.reply({content:`The private thread ${private_text_thread} has been created for you`,ephemeral:true});

            if (private_text_thread) {
                student_cache.set(discord_user_username+`Logged in`, true);
            }
        }
    }
    return create_private_thread_object;
}