import { ChannelType, Interaction, SlashCommandBuilder, User} from 'discord.js';
import StudentRepository from '../database/StudentRepository';
import Cache from '../utils/Cache';

export default function() {
    const create_homework_document_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-homework-reminder')
        .setDescription('Use this command to create a homework document reminder with a summary note attached')
        .addStringOption(options =>
            options.setName('homework_document_title')
            .setDescription('(Required) your homework document')
            .setRequired(true))
        .addStringOption(options =>
            options.setName('homework_document_due_date')
            .setDescription('(Required) your homework document due date')
            .setRequired(true))
        .addStringOption(options => 
            options.setName('homework_class')
            .setDescription('(Required) the class which assigns your homework')
            .setRequired(true))
        .addStringOption(options =>
            options.setName('homework_document_start_date')
            .setDescription('(Optional) when your homework document was assigned')
            .setRequired(false))
        .addStringOption(options =>
            options.setName('homework_document_summary')
            .setDescription('(Optional) a summary of your homework document')
            .setRequired(false)),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const invoker_channel = interaction.channel;
        
            if (!invoker_channel) {
                interaction.reply({content:`The bot has experienced an error when setting a homework document. Please contact the bot developer and say 'the thread cannot be fetched'`, ephemeral:true});
                return;
            }

            if (invoker_channel.isThread()) {
                const invoking_user:User = interaction.user;
                const student_repository: StudentRepository = new StudentRepository();
                const discord_user_username: string = interaction.user.username;

                const discord_user_in_database = student_repository.findByDiscordUsername(discord_user_username);

                if (!discord_user_in_database) {
                    interaction.reply({content:`Please register an account before trying this`,ephemeral:true});
                    return;
                }

                
            } else {
                interaction.reply({content:`Please try and use this command while inside of a private thread.`,ephemeral:true});
                return;
            }
        }
    }
}