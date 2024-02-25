import { SlashCommandBuilder } from 'discord.js';
import CustomEventEmitter from '../utils/CustomEventEmitter';
import CommonClass from '../entity/CommonClass';
import CommonClassRepository from '../database/CommonClassRepository';

export default function() {
    const create_common_class_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-scheduled-event')
        .setDescription('Use this command to create one scheduled event per class.'),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const custom_event_emitter: CustomEventEmitter = CustomEventEmitter.getCustomEventEmitterInstance();
            
            const common_class_repository:CommonClassRepository = new CommonClassRepository();

            try {
                const classes: CommonClass[] | undefined = await common_class_repository.findAll();

                if (!classes) {
                    await interaction.reply({content:`There was an error retrieving the list of classes for today. Please inform the server administrator of this error or try executing the command again`});
                } 
                
                custom_event_emitter.emitGuildEventCreationMessage(classes);
                await interaction.reply({content:`An event for each class has been created`,ephemeral: true});
            } catch (error) {
                await interaction.reply({content:`There was an error when trying to create scheduled events in discord: ${error}`});
                throw error;
            }
        }
    }
    return create_common_class_object;
}