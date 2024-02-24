import { ChannelType, Guild, SlashCommandBuilder } from "discord.js";

export default function() {
    const create_voice_channel_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-voice-channel')
            .setDescription(`Create a voice channel to use`)
            .addStringOption(option =>
                option.setName(`voice_channel_name`)
                .setDescription(`(Required) Set the name for the voice channel`)
                .setRequired(true)
            )
            .addStringOption(option =>
                option.setName(`category_for_voice_channel`)
                .setDescription(`(Required) Category where the new voice channel will be created`)
                .setRequired(true)
            ),
            authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const voice_channel_name = interaction.options.getString("voice_channel_name");
            const category_name_for_voice_channel = interaction.options.getString("category_for_voice_channel");

            const category_channel = interaction.guild.channels.cache.find(voice_channels_category => voice_channels_category.name === category_name_for_voice_channel 
                && voice_channels_category.type === ChannelType.GuildCategory);

            if (!category_channel) {
                await interaction.reply({content:`The category that you specified does not exist or is not a valid category. Please create a category with this name or contact the server administrator if you believe this is an error`, ephemeral: true});
                return;
            }

            try {
                let voice_channel = await interaction.guild.channels.create({
                    name: `${voice_channel_name}`,
                    type: ChannelType.GuildVoice,
                    parent: category_channel.id
                });

                await interaction.reply({content:`The voice channel ${voice_channel} was created successfully in the category ${category_channel}`,ephemeral:true});
            } catch (error) {
                console.error(`There was an error creating your specified voice channel: ${error}`);
                await interaction.reply({content:`There was an error while creating the specified voice channel`, ephemeral: true});
            }
        }
    }

    return create_voice_channel_object;
}

