import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default function() {
    const setup_command_object: Object = {
        data: new SlashCommandBuilder()
            .setName('setupuser')
            .setDescription('Set up bot website user for this server'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            // Create and send the modal dialog box to the user
            const modal = new ModalBuilder()
                .setCustomId('userDataInputModal')
                .setTitle('Enter channel ids below');

            const emailInput = new TextInputBuilder()
                .setCustomId('emailInput')
                .setLabel('Bot user email')
                .setRequired(true)
                .setPlaceholder('A valid email (e.g., johndoe02@gmail.com)')
                .setStyle(TextInputStyle.Short);

            const usernameInput = new TextInputBuilder()
                .setCustomId('usernameInput')
                .setLabel('User')
                .setRequired(true)
                .setPlaceholder('A valid username (e.g., user1)')
                .setStyle(TextInputStyle.Short);

            const passwordInput = new TextInputBuilder()
                .setCustomId('passwordInput')
                .setLabel('User password')
                .setRequired(true)
                .setPlaceholder('A valid password (e.g., pass1)')
                .setStyle(TextInputStyle.Short);

            const botIdInput = new TextInputBuilder()
                .setCustomId('botIdInput')
                .setLabel('Bot id')
                .setRequired(true)
                .setMinLength(18)
                .setMaxLength(19)
                .setPlaceholder('18 or 19 digit string (e.g., 2222222222222222222)')
                .setStyle(TextInputStyle.Short);


            // Add action rows to the modal for each text input field
            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(emailInput);
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(usernameInput);
            const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(passwordInput);
            const fourthActinRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(botIdInput);

            // Add action rows to the modal
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActinRow);

            // Show the modal dialog box to the user
            try {
                await interaction.showModal(modal);
            } catch (error) {
                await interaction.reply({content:`There was an error when attempting to show the setup modal: ${error}`,ephemeral:true});
                throw new Error(`There was an error when attempting to show the setup modal: ${error}`);
            }
        }
    }
    return setup_command_object;
}
