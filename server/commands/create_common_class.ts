import { SlashCommandBuilder } from 'discord.js';
import CommonClassRepository from '../database/MySQL/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import { randomUUID } from 'crypto';

export default function() {
    const create_common_class_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-class')
        .setDescription('Use this command to create a class.')
        .addStringOption(options =>
            options.setName('class_name')
            .setDescription('(Required) Class course name (e.g. Advanced Database)')
            .setRequired(true))
        .addStringOption(options => 
            options.setName('class_course_code')    
            .setDescription('(Required) Class course code (e.g. comp2006)')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_start_time')
            .setDescription('(Required) Class start time in EST (e.g., 12:00:00)')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_end_time')   
            .setDescription('(Required) Class end time in EST (e.g., 12:00:00)')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_runs_monday')   
            .setDescription('(Required) true or false')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_runs_tuesday')   
            .setDescription('(Required) true or false')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_runs_wednesday')   
            .setDescription('(Required) true or false')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_runs_thursday')   
            .setDescription('(Required) true or false')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('class_runs_friday')   
            .setDescription('(Required) true or false')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const common_class_repository:CommonClassRepository = new CommonClassRepository();

            const class_name: string = interaction.options.getString('class_name');
            const class_course_code: string = interaction.options.getString('class_course_code');
            const class_start_time: string = interaction.options.getString('class_start_time');
            const class_end_time: string = interaction.options.getString('class_end_time');

            const class_run_days_options:string[] = ["class_runs_monday", "class_runs_tuesday", "class_runs_wednesday", "class_runs_thursday", "class_runs_friday"];
            const class_run_days_values: Map<string, number> = new Map<string, number>();
            
            for (const class_day of class_run_days_options) {
                if (interaction.options.getString(class_day) === 'true') {
                    class_run_days_values.set(class_day, 1);
                } else {
                    class_run_days_values.set(class_day, 0);
                }
            }

            const common_class = new CommonClass(
                randomUUID(),
                class_start_time,
                class_end_time,
                class_course_code,
                class_name,
                class_run_days_values.get("class_runs_monday"),
                class_run_days_values.get("class_runs_tuesday"),
                class_run_days_values.get("class_runs_wednesday"), 
                class_run_days_values.get("class_runs_thursday"),
                class_run_days_values.get("class_runs_friday")
            );
            
            try {
                await common_class_repository.create(common_class);
                await interaction.reply({content:`A class was created successfully`,ephemeral: true});
            } catch (error) {
                await interaction.reply({content:`The bot was unable to create a student class. Please try the command again or inform the server administrator of this error: ${error}`});
                throw error;
            }            
        }
    }
    return create_common_class_object;
}