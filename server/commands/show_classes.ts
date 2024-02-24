import { SlashCommandBuilder } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import CustomEventEmitter from '../utils/CustomEventEmitter';

export default function() {
    const show_classes_object: Object = {
        data: new SlashCommandBuilder()
            .setName('show-classes')
            .setDescription('Use this command to show all of the registered classes'),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const common_class_repository:CommonClassRepository = new CommonClassRepository();
            const custom_event_emitter = CustomEventEmitter.getCustomEventEmitterInstance();

            const classes: CommonClass[] | undefined = await common_class_repository.findAll();
            custom_event_emitter.emitCommonClassDataMessage(classes);

            interaction.reply({content:`The classes that are registered in the Discord bot for this semester will be displayed shortly`,ephemeral: true});
        }
    }
    return show_classes_object;
}