import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const generate_help_message: Object = {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Lists all available bot commands'),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const commands_list_strings: string[] = [
                "**1. /create-group - This command is used to create a private DM group for up to 4 people including yourself**",
                "**2. /placeinfo - This command is used to generate information about a location of your choosing**",
                "**3. /create-user - This command is used to create a new user that is registered with our discord server bot**",
                "**4. /create-session - This command is used to create a private thread inside of a discord channel for you only. You can later add others to the group**",
                "**5. /delete-user - This command is used to delete a user from the discord bot. You can only use this command on yourself**",
                "**6. /hello-world - Generates a nice hello world message with instructions on how to get started (generating this 'help' list)**",
                "**7. /help - Generates this same list again!**"
            ];
            await interaction.reply(`**Available Commands:**\n${commands_list_strings.join('\n')}`);
        }
    }
    return generate_help_message;
}