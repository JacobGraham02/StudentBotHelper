import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default function() {
    const setup_command_object: Object = {
        data: new SlashCommandBuilder()
            .setName('setupchannels')
            .setDescription('Set up bot channel ids for this server'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            // Create and send the modal dialog box to the user
            const modal = new ModalBuilder()
                .setCustomId(`channelIdInputModal`)
                .setTitle(`Enter channel ids here:`);

            const botRoleButtonChannelIdInput = new TextInputBuilder()
                .setCustomId(`roleButtonChannelIdInput`)
                .setLabel(`Bot role button channel id`)
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder(`18 or 19 digit string (e.g., 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const botCommandsChannelIdInput = new TextInputBuilder()
                .setCustomId(`commandChannelIdInput`)
                .setLabel(`Bot commands channel id`)
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder(`18 or 19 digit string (e.g., 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const botCommandsInfoChannelIdInput = new TextInputBuilder()
                .setCustomId(`informationChannelIdInput`)
                .setLabel(`Bot command info channel id`)
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder(`18 or 19 digit string (e.g., 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const botCommandsErrorsChannelIdInput = new TextInputBuilder()
                .setCustomId(`errorChannelIdInput`)
                .setLabel(`Bot command errors channel id`)
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder(`18 or 19 digit string (e.g., 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const botIdInput = new TextInputBuilder()
                .setCustomId(`botIdInput`)
                .setLabel(`Bot id`)
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder(`18 or 19 digit string (e.g., 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            // Add action rows to the modal for each text input field
            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botRoleButtonChannelIdInput);
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botCommandsChannelIdInput);
            const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botCommandsInfoChannelIdInput);
            const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botCommandsErrorsChannelIdInput);
            const fifthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botIdInput);

            // Add action rows to the modal
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

            // Show the modal dialog box to the user
            try {
                await interaction.showModal(modal);
            } catch (error) {
                await interaction.reply({content:`There was an error when attempting to show the setup modal`,ephemeral:true});
                throw new Error(`There was an error when attempting to show the setup modal: ${error}`);
            }
        }
    }
    return setup_command_object;
}
