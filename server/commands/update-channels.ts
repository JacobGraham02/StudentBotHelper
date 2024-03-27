import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const generate_help_message_object: Object = {
        data: new SlashCommandBuilder()
            .setName('updatechannels')
            .setDescription('Lists all available bot commands'),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {   
            try {
                await interaction.reply({content:`The bot channel ids have been updated`,ephemeral:true});
            } catch (error) {
                await interaction.reply({content:`The bot channel ids have been updated`,ephemeral:true});
            }
        }
    }
    return generate_help_message_object;
}