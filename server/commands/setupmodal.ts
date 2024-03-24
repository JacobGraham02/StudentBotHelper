import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default function() {
    const setup_command_object: Object = {
        data: new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Set up the bot for your server'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            // Create and send the modal dialog box to the user
            const modal = new ModalBuilder()
                .setCustomId(`channelIdInputModal`)
                .setTitle(`Enter channel ids here:`);

            // Define text input fields for each channel ID
            const commandChannelIdInput = new TextInputBuilder()
                .setCustomId(`commandChannelIdInput`)
                .setLabel(`Bot command channel id`)
                .setRequired(true)
                .setMinLength(19)
                .setMaxLength(19)
                .setPlaceholder(`19 digit string (e.g. 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const informationChannelIdInput = new TextInputBuilder()
                .setCustomId(`informationChannelIdInput`)
                .setLabel(`Information channel id`)
                .setRequired(true)
                .setMinLength(19)
                .setMaxLength(19)
                .setPlaceholder(`19 digit string (e.g. 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const errorMessageChannelIdInput = new TextInputBuilder()
                .setCustomId(`errorChannelIdInput`)
                .setLabel(`Error channel id`)
                .setRequired(true)
                .setMinLength(19)
                .setMaxLength(19)
                .setPlaceholder(`19 digit string (e.g. 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            const botRoleButtonChannelIdInput = new TextInputBuilder()
                .setCustomId(`botRoleButtonChannelIdInput`)
                .setLabel(`Bot role button channel id`)
                .setRequired(true)
                .setMinLength(19)
                .setMaxLength(19)
                .setPlaceholder(`19 digit string (e.g. 2222222222222222222)`)
                .setStyle(TextInputStyle.Short);

            // Add action rows to the modal for each text input field
            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botRoleButtonChannelIdInput);
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(commandChannelIdInput);
            const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(informationChannelIdInput);
            const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(errorMessageChannelIdInput);

            // Add action rows to the modal
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

            // Show the modal dialog box to the user
            try {
                await interaction.showModal(modal);
            } catch (error) {
                await interaction.reply({content:`There was an error when attempting to show the setup modal`,ephemeral:true});
            }
        }
    }
    return setup_command_object;
}
