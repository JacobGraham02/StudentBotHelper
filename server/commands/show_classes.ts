import { SlashCommandBuilder } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import CustomEventEmitter from '../utils/CustomEventEmitter';

export default function() {
    const show_classes_object: Object = {
        data: new SlashCommandBuilder()
            .setName('show-classes')
            .setDescription('Use this command to show all classes relevant to you'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const common_class_repository:CommonClassRepository = new CommonClassRepository();
            const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();

            const classes: CommonClass[] | undefined = await common_class_repository.findAll();
            custom_event_emitter.emitCommonClassDataMessage(classes);

            interaction.reply({content:`The classes for this semester will display shortly`,ephemeral: true});
        }
    }
    return show_classes_object;
}