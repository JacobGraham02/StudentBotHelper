import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const change_bot_avatar_object: Object = {
        data: new SlashCommandBuilder()
            .setName('change-bot-avatar')
            .setDescription(`Use this command to change the avatar of the bot through a URI or attachment`)
            .addStringOption(option =>
                option.setName('bot_avatar_uri')
                .setDescription(`(Optional) Enter the URL image for the bot`)    
                .setRequired(false)
            ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const new_bot_avatar_uri: string = interaction.options.getString('bot_avatar_uri');
            const new_bot_avatar_attachments = interaction.options.getMessage('bot_avatar_uri')?.attachments;

            if (!new_bot_avatar_uri && (!new_bot_avatar_attachments || new_bot_avatar_attachments.size === 0)) {                
                interaction.reply({content:`The new Discord bot avatar URI is undefined or there are no image attachments. Please contact the server administrator and inform them of this error`,ephemeral: true});
                return;
            }

            try {
                if (new_bot_avatar_uri) {
                    await interaction.client.user.setAvatar(new_bot_avatar_uri);
                    await interaction.reply({content: `The Discord bot avatar has been changed to the image located at the URI ${new_bot_avatar_uri}`, ephemeral: true});
                } else if (new_bot_avatar_attachments && new_bot_avatar_attachments.size >= 1) {
                    const new_bot_avatar_image_attachment = new_bot_avatar_attachments.first();
                    await interaction.client.user.setAvatar(new_bot_avatar_image_attachment.url);
                    await interaction.reply({content: 'The Discord bot avatar has been changed to the attached image', ephemeral: true});
                }
                await interaction.reply({content:`The Discord bot avatar has been changed to ${new_bot_avatar_uri}`, ephemeral: true});
            } catch (error) {
                console.error(`There was an error when attempting to change the Discord bot avatar: ${error}`);
                await interaction.reply({content:`There was an error when attempting to change the Discord bot avatar. Please contact the server administrator and inform them of this error: ${error}`});
                throw error;
            }
        }
    }
    return change_bot_avatar_object;
}