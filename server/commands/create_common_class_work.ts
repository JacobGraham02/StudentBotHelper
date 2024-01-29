import { ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import { StringSelectMenuOptionBuilder } from '@discordjs/builders';
import CommonClassWork from '../entity/CommonClassWork';
import { randomUUID } from 'crypto';
import CommonClassWorkRepository from '../database/CommonClassWorkRepository';

export default function() {
    const create_common_class_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-common-class-work')
        .setDescription('Use this command to create a private thread for yourself.')
        .addStringOption(option =>
            option.setName('homework_name')
            .setDescription('Set the name of the homework document')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('homework_due_date')
            .setDescription('Set the homework due date and time')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('homework_notes')
            .setDescription('Set any notes for the homework')
            .setRequired(false)
        ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const common_class_repository:CommonClassRepository = new CommonClassRepository();
            let classes: CommonClass[] | undefined;

            try {
                classes = await common_class_repository.findAll();
            } catch (error) {
                await interaction.reply(`There was an error when attempting to get class work for classes. Please try the command again or inform the bot developer of this error: ${error}`);
                return;
            }
            
            if (classes === undefined || classes.length === 0) {
                interaction.reply({content:`There are no classes which you can assign work to`,ephemeral:true});
                return;
            }
            const select_class_menu = new StringSelectMenuBuilder()
                .setCustomId('select_class')
                .setPlaceholder('Select a class to assign work')

            classes.forEach(common_class => {
                const option = new StringSelectMenuOptionBuilder()
                    .setLabel(common_class.commonClassInformation().class_name)
                    .setDescription(common_class.commonClassInformation().class_name + ' class work that was assigned')
                    .setValue(common_class.commonClassInformation().class_id);
                select_class_menu.addOptions(option);
            });

            const common_classes_row = new ActionRowBuilder()
                .addComponents(select_class_menu);

            const sent_message = await interaction.channel.send({content:`Choose a class to assign this work to:`, components: [common_classes_row], ephemeral: true});
            
            const collector = sent_message.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
                
            collector.on('collect', async (class_menu_interaction) => {
                const common_class_work_repository: CommonClassWorkRepository = new CommonClassWorkRepository();
                const work_document_name = interaction.options.getString('homework_name');
                const work_document_due_date = interaction.options.getString('homework_due_date');
                const work_document_notes = interaction.options.getString('homework_notes');
                const selected_class_id = class_menu_interaction.values[0];
                const common_class_work_document: CommonClassWork = new CommonClassWork(
                    randomUUID(), 
                    selected_class_id,
                    work_document_name,
                    work_document_due_date,
                    work_document_notes 
                );
                try {
                    await common_class_work_repository.create(common_class_work_document);
                    await interaction.channel.send({content:`A new work document was created`,ephemeral:true});
                } catch (error) {
                    await interaction.channel.send({content:`There was an error when creating a new work document. Please inform the bot developer of this error: ${error}`,ephemeral:true});
                    return;
                }
            });
                
            collector.on('end', async (class_menu_interaction) => {
                if (class_menu_interaction.size === 0) {
                    await interaction.channel.send({content:`No class was selected for this work document. Please retype the command and try again`, ephemeral:true});
                }
            });
        }
    }
    return create_common_class_object;
}

