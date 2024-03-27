import { ChannelType, SlashCommandBuilder, ThreadAutoArchiveDuration, ThreadChannel } from 'discord.js';

export default function() {
    const create_private_thread_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-thread')
        .setDescription('Use this command to create a private thread for yourself.')
        .addStringOption(options =>
            options.setName('username')
            .setDescription('(Required) your username')
            .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Required) The first user for the thread')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
            const discord_user_username: string = interaction.user.username;
            const channel_to_create_thread = interaction.channel;
            let private_text_thread: any;

            try {
                private_text_thread = await channel_to_create_thread.threads.create({
                    name: `Private thread for ${discord_user_username}`,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                    type: ChannelType.PrivateThread,
                    reason: `Private thread for ${discord_user_username}`
                });
            } catch (error) {
                await interaction.reply({content:`There was an error when creating the private text thread ${private_text_thread}: ${error}`});
                throw error;
            }
                
            await interaction.reply({content:`The private thread ${private_text_thread} has been created for you`,ephemeral:true});
        }
    }
    return create_private_thread_object;
}