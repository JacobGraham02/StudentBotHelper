import { ChannelType, SlashCommandBuilder, ThreadAutoArchiveDuration, User } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import Cache from '../utils/Cache';

export default function() {
    const create_private_thread_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-session')
        .setDescription('Use this command to create a private thread for yourself.')
        .addStringOption(options =>
            options.setName('class_name')
            .setDescription('(Required) Class course name')
            .setRequired(true))
        .addStringOption(options => 
            options.setName('class_course_code')    
            .setDescription('(Required) Class course code')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_start_time')
            .setDescription('(Required) Class start time in EST (e.g., 12:00)')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_end_time')   
            .setDescription('(Required) Class end time in EST (e.g., 12:00')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const student_cache: Cache = Cache.getCacheInstance();
            const common_class_repository:CommonClassRepository = new CommonClassRepository();
            
            const class_name: string = interaction.user.class_name;
            const class_course_code: string = interaction.user.class_course_code;
            const class_start_time: string = interaction.user.class_start_time;
            const class_end_time: string = interaction.user.class_end_time;
        }
    }
    return create_private_thread_object;
}