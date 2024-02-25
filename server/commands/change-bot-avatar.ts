import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const change_bot_avatar_object: Object = {
        data: new SlashCommandBuilder()
            .setName('change-bot-avatar')
            .setDescription(`Use this command to change the avatar of the bot. Can also use an image attachment for the bot avatar`)
            .addStringOption(option =>
                option.setName('bot_avatar_uri')
                .setDescription(`(Optional) Enter the URL image for the bot`)    
                .setRequired(false)
            ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const new_bot_avatar_uri: string = interaction.options.getString('bot_username');

            if (!new_bot_avatar_uri) {
                interaction.reply({content:`The new Discord bot avatar URL is undefined. Please contact the server administrator and inform them of this error`,ephemeral: true});
                return;
            }

            try {
                if (new_bot_avatar_uri) {
                    await interaction.client.user.setAvatar(new_bot_avatar_uri);
                    await interaction.reply({content:`The Discord bot avatar has been changed to ${new_bot_avatar_uri}`, ephemeral: true});
                } else if (interaction.message.attachments.size >= 1) {
                    const new_bot_avatar_image_attachment = interaction.message.attachments.first();
                    await interaction.client.user.setAvatar(new_bot_avatar_image_attachment);
                    await interaction.reply({content:`The Discord bot avatar has been changed to the attached image`, ephemeral: true});
                } else {
                    await interaction.reply({content:`There was no avatar URI or attachment provided. Please provide a valid URI or attach an image.`, ephemeral: true});
                }
                await interaction.reply({content:`The Discord bot avatar has been changed to ${new_bot_avatar_uri}`, ephemeral: true});
            } catch (error) {
                console.error(`There was an error when attempting to change the Discord bot avatar: ${error}`);
                await interaction.reply({content:`There was an error when attempting to change the Discord bot avatar. Please contact the server administrator and inform them of this error`});
                throw error;
            }
        }
    }
    return change_bot_avatar_object;
}