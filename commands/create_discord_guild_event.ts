import { SlashCommandBuilder } from 'discord.js';
import CustomEventEmitter from '../utils/CustomEventEmitter';
import CommonClass from '../entity/CommonClass';
import CommonClassRepository from '../database/CommonClassRepository';

export default function() {
    const create_common_class_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-discord-guild-event')
        .setDescription('Use this command to auto-populate Discord server with class guild events'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const days_of_week: string[] = ["sunday", "monday","tuesday","wednesday","thursday","friday", "saturday"];
            const today: Date = new Date();
            const day_of_week: string = `${days_of_week[today.getDay()]}`;
            
            if (day_of_week === "sunday" || day_of_week === "saturday") {
                await interaction.reply({content:`Please take a break from school work on the weekends`,ephemeral:true});
                return;
            } 

            const common_class_repository:CommonClassRepository = new CommonClassRepository();

            const classes: CommonClass[] | undefined = await common_class_repository.findAll();

            if (classes === undefined) {
                await interaction.reply({content:`There was an error retrieving the list of classes for today. Please inform the bot developer of this error or try executing the command again`});
            } 
            
            const custom_event_emitter: CustomEventEmitter = CustomEventEmitter.getCustomEventEmitterInstance();

            custom_event_emitter.emitGuildEventCreationMessage(classes, day_of_week);
            
            await interaction.reply({content:`An event for each class has been created`,ephemeral: true});
        }
    }
    return create_common_class_object;
}