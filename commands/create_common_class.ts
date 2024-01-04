import { SlashCommandBuilder } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import { randomUUID } from 'crypto';

export default function() {
    const create_common_class_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-common-class')
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
            const common_class_repository:CommonClassRepository = new CommonClassRepository();

            const class_name: string = interaction.options.getString('class_name');
            const class_course_code: string = interaction.options.getString('class_course_code');
            const class_start_time: string = interaction.options.getString('class_start_time');
            const class_end_time: string = interaction.options.getString('class_end_time');

            const common_class = new CommonClass(
                randomUUID(),
                class_start_time,
                class_end_time,
                class_course_code,
                class_name
            );
            await common_class_repository.create(common_class);
            await interaction.reply({content:`A common class that all students have in common was created successfully`,ephemeral: true});
        }
    }
    return create_common_class_object;
}