import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export default function() {
    const create_bot_role_button_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-bot-role-button')
            .setDescription(`Adds a button which allows users to grant themselves access to the bot.`)
            .addChannelOption(option => 
                option.setName(`channel`)
                .setDescription(`(Optional) The channel in which to add this button`)
                .setRequired(false)
            ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            let channel_to_add_button = interaction.options.channel;

            if (channel_to_add_button === undefined) {
                channel_to_add_button = interaction.channel;
            }

            if (channel_to_add_button !== null) {
                try {
                    await channel_to_add_button.send({ 
                        content: `Click the button to get the 'Bot user' role`, 
                        components: [new ActionRowBuilder<ButtonBuilder>({
                            components: [
                                new ButtonBuilder({
                                    customId: `assign_bot_role_button`,
                                    label: `Click to become a bot user`,
                                    style: ButtonStyle.Success
                                })
                            ]
                        })]
                    });
                    await interaction.reply({ content: `The bot role button has been added to the channel ${channel_to_add_button}`, ephemeral:true});
                } catch (error) {
                    await interaction.reply({ content: `There was an error when attempting to add the bot role button to the channel: ${channel_to_add_button}. Please inform the bot developer of this error: ${error}`, ephemeral:true});
                    throw new Error(`There was an error when attempting to add the bot role button to the channel: ${channel_to_add_button}. Please inform the bot developer of this error: ${error}`);
                }
            }
        }
    }
    return create_bot_role_button_object;
}