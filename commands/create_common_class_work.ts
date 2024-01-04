import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import CommonClassRepository from '../database/CommonClassRepository';
import CommonClass from '../entity/CommonClass';
import { StringSelectMenuOptionBuilder } from '@discordjs/builders';

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
            const classes: CommonClass[] | undefined = await common_class_repository.findAll();
            
            if (classes === undefined || classes.length === 0) {
                interaction.reply({content:`There are no classes which you can assign work to!`,ephemeral:true});
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
            
            await interaction.reply({content:`Choose a class to assign this work to:`, components: [common_classes_row], ephemeral: true});

            const filter = (select_menu_interaction) => select_menu_interaction.customId === 'select_class' && select_menu_interaction.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (selectMenuInteraction) => {
                if (selectMenuInteraction.customId === 'select_class') {
                    const selectedClassId = selectMenuInteraction.values[0];
                    await selectMenuInteraction.reply(`You selected the class with ID: ${selectedClassId}`);
                }
            });
            
            collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));
        }
    }
    return create_common_class_object;
}

/*
const filter = i => i.customId === 'select_class' && i.user.id === interaction.user.id;
const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

collector.on('collect', async i => {
    if (i.customId === 'select_class') {
        const selectedClassId = i.values[0];
        await i.reply(`You selected the class with ID: ${selectedClassId}`);
        // additional handling for the selected option
    }
});

collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));

*/