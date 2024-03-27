import {ChannelType, PermissionsBitField, SlashCommandBuilder, User } from 'discord.js';

export default function() {
    const create_dm_group_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-dm-group')
            .setDescription('Use this command to create a private DM group between yourself and up to three others.')
            .addStringOption(options => 
                options.setName('group_name')
                .setDescription('(Required) The group name')
                .setRequired(true))
            .addUserOption(option => 
                option.setName('user_1')
                .setDescription('(Required) The first user for the group')
                .setRequired(true))
            .addUserOption(option => 
                option.setName('user_2')
                .setDescription('(Optional) the second member for the group')
                .setRequired(false))
            .addUserOption(option => 
                option.setName('user_3')
                .setDescription('(Optional) The third user for the group')
                .setRequired(false))
            .addUserOption(option => 
                option.setName('user_4')
                .setDescription('(Optional) The fourth user for the group')
                .setRequired(false)
            ),
            
        authorization_role_name: ["Discord admin","Bot user"],

        async execute(interaction) {
            let new_dm_group;
            
            const permissionOverwrites = [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    allow: [] as bigint[]
                }
                
            ]
            const group_name_option:string = 'group_name';
            const user_options: string[] = ['user_1', 'user_2', 'user_3', 'user_4'];
            const users: User[] = [];

            for (const option_name of user_options) {
                const user = interaction.options.getUser(option_name);
                if (user) {
                    users.push(user);
                }
            }

            for (const user of users) {
                if (user) {
                    permissionOverwrites.push(
                        {
                            id: user.id,
                            deny: [],
                            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory,]
                        }
                    );
                }
            }

            try {
                new_dm_group = await interaction.guild.channels.create({
                    name: interaction.options.getString(group_name_option),
                    type: ChannelType.GuildText,
                    permissionOverwrites: permissionOverwrites,
                });
                await interaction.reply({content: `The dm group ${new_dm_group.name} has been created`, ephemeral: true});
            } catch (error) {
                await interaction.reply({content: `There was an error when attempting to create the dm group ${new_dm_group.name}. Please inform the server administrator of this error: ${error}`, ephemeral: true});
                throw error;
            }
        }
    }

    return create_dm_group_object;
}