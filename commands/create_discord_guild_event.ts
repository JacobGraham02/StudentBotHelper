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
            const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();
            const common_class_repository:CommonClassRepository = new CommonClassRepository();

            const classes: CommonClass[] | undefined = await common_class_repository.findAll();

            custom_event_emitter.emitGuildEventCreationMessage(classes);
            
            await interaction.reply({content:`An event for each class has been created`,ephemeral: true});
        }
    }
    return create_common_class_object;
}