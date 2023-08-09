import { SlashCommandBuilder } from '@discordjs/builders';
import { UUID } from 'crypto';

export default function() {
    const object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-group')
            .setDescription('Use this command to create a private thread with a maximum of 4 people (including yourself)')
            .addStringOption(option => 
                option.setName('user_1')
                .setDescription('The first user for the group')
                .setRequired(true))
            .addStringOption(option => 
                option.setName('user_2')
                .setDescription('(Optional) the second member for the group')
                .setRequired(false))
            .addStringOption(option => 
                option.setName('user_3')
                .setDescription('The third user for the group')
                .setRequired(false))
            .addStringOption(option => 
                option.setName('user_4')
                .setDescription('The fourth user for the group')
                .setRequired(false)),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const channel = interaction.channel;

            if (!channel || channel.type !== 'GUILD_TEXT') {
                return await interaction.reply('This command can only be used in a dedicated text channel');
            }

            const private_text_thread = await channel.threads.create({
                name: `Group thread - ${interaction.user.username}`,
                autoArchiveDuration: 10080, // Duration in minutes
                reason: 'This thread is for discussing something important'
            });

            // Fetch users from the interaction options
            const users = [
                interaction.options.getUser('user_1'),
                interaction.options.getUser('user_2'),
                interaction.options.getUser('user_3'),
                interaction.options.getUser('user_4')
            ].filter(Boolean)
            
            for (const user of users) {
                await private_text_thread.members.add(user);
            }

            // Set initial permissions to make the thread private
            await private_text_thread.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                VIEW_CHANNEL: false
            });

            // Allow the command invoker to see the thread
            await private_text_thread.permissionOverwrites.edit(interaction.user, {
                VIEW_CHANNEL: true,
                SEND_MESSAGE: true,
                READ_MESSAGE_HISTORY: true
            });

            // Allow specified users to see the thread
            for (const user of users) {
                await private_text_thread.permissionOverwrites.edit(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true
                });
            }
            await interaction.reply(`Your thread ${private_text_thread.name} has been created. Enjoy!`);
        }
    }
    return object;
}