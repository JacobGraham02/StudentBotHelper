import { ChannelType, SlashCommandBuilder, TextChannel, ThreadAutoArchiveDuration, User } from 'discord.js';

export default function() {
    const create_private_thread_object: Object = {
        data: new SlashCommandBuilder()
        .setName('create-session')
        .setDescription('Use this command to create a private thread for yourself.')
        .addStringOption(options =>
            options.setName('username')
            .setDescription('(Required) your username')
            .setRequired(true))
        .addStringOption(options => 
            options.setName('password')    
            .setDescription('(Required) your password')
            .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Required) The first user for the group')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const category_id = "1110654950066896957"; 
            const thread_owner_username:string = 'username';
            const thread_owner_password:string = 'password';
            const thread_owner_user: User = interaction.options.getUser('user');
            
            // if (interaction.channel.type === 'GUILD_TEXT' || interaction.channel.type === 'GUILD_NEWS') {
                const channel_to_create_thread = interaction.channel;

                const private_text_thread = await channel_to_create_thread.threads.create({
                    name: `Private session for ${thread_owner_username}`,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                    type: ChannelType.PrivateThread,
                    reason: `This thread is a user session ${thread_owner_username}`
                });
            // } else {
            //     interaction.reply({content:'A private thread can only be created in a text channel.',ephemeral:true});
            //     return;
            // }
            interaction.reply({content:'A private thread has been successfully created',emphermal:true});
        }
    }
    return create_private_thread_object;
}