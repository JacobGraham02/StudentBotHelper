import {ChannelType, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { UUID } from 'crypto';

export default function() {
    const object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-group')
            .setDescription('Use this command to create a private thread with a maximum of 4 people (including yourself)')
            .addUserOption(option => 
                option.setName('user_1')
                .setDescription('The first user for the group')
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
                .setRequired(false)),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const category_id = "1110654950066896957";
            
            const permissionOverwrites = [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    allow: [] as bigint[]
                }
                
            ]

            const users = [
                interaction.options.getUser('user_1'),
                interaction.options.getUser('user_2'),
                interaction.options.getUser('user_3'),
                interaction.options.getUser('user_4'),
            ];
            
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

            const newChannel = await interaction.guild.channels.create({
                name: "hello",
                type: ChannelType.GuildText,
                permissionOverwrites: permissionOverwrites,
                parent: category_id
            });
        
            await interaction.reply(`Channel ${newChannel.name} has been created!`);
        }
    }

    return object;
}