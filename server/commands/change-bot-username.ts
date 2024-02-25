import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const show_classes_object: Object = {
        data: new SlashCommandBuilder()
            .setName('change-bot-username')
            .setDescription(`Use this command to change the username of the bot`)
            .addStringOption(option =>
                option.setName('bot_username')
                .setDescription(`Enter a new username for the bot`)    
                .setRequired(true)
            ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const new_bot_username = interaction.options.getString('bot_username');

            if (!new_bot_username) {
                interaction.reply({content:`The username that the bot will be renamed to is undefined. Please contact the server administrator and inform them of this error`,ephemeral: true});
                return;
            }

            try {
                await interaction.client.user.setUsername(new_bot_username);
                interaction.reply({content:`The Discord bot username has been changed to ${new_bot_username}`, ephemeral: true});
            } catch (error) {
                console.error(`There was an error when attempting to change the Discord bot username: ${error}`);
                interaction.reply({content:`There was an error when attempting to change the Discord bot username. Please contact the server administrator and inform them of this error`});
                throw error;
            }

            interaction.reply({content:`The classes that are registered in the Discord bot for this semester will be displayed shortly`,ephemeral: true});
        }
    }
    return show_classes_object;
}