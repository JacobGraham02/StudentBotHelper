import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const create_new_user_object: Object = {
        data: new SlashCommandBuilder()
            .setName('hello-world')
            .setDescription('Use this command to get a hello world message!'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const discord_user_username: string = interaction.user.username;
            await interaction.reply({content:`Hello, ${discord_user_username}. Welcome to the bot command channel! What can I help you with? Use the command '/help' to view a list of available commands`,ephemeral:true});
        }
    }
    return create_new_user_object
}