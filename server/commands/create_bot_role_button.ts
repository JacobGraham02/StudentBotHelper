import { SlashCommandBuilder, Interaction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ActionRowData, ActionRow } from "discord.js";

export default function() {
    const create_bot_role_button_object: Object = {
        data: new SlashCommandBuilder()
            .setName('add-bot-role-button')
            .setDescription(`Adds a button which allows users to grant themselves access to the bot`)
            .addChannelOption(option => 
                option.setName(`channel`)
                .setDescription(`The channel in which to add this button (Optional)`)
                .setRequired(false)
            ),
            authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            let channel_to_add_button = interaction.options.channel;

            if (channel_to_add_button === undefined) {
                channel_to_add_button = interaction.channel;
            }

            if (channel_to_add_button !== null) {
                await channel_to_add_button.send({ 
                    content: `Click the button to get the bot-user role`, 
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
                await interaction.reply({ content: `Bot button added to the channel ${channel_to_add_button}`});
            }
        }
    }
    return create_bot_role_button_object;
}