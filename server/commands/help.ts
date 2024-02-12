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
                "**2. /create-common-class-work - This command is used by the server administrator to create class work that is common to most other students**",
                "**3. /create-common-class - This command is used by the server administrator to create a class that is common to most other students**",
                "**4. /create-discord-guild-event - This command is used by the server administrator to generate a Discord event that shows every user when classes occur that day**",
                "**5. /create-group - This command is used by any user to create a private group within the server for themself and up to four other players**",
                "**6. /placeinfo - This command is used to generate information about a location of your choosing**",
                "**7. /create-user - This command is used to create a new user that is registered with our discord server bot**",
                "**8. /create-private-thread - This command is used to create a private thread inside of a discord channel for you only. You can later add others to the group**",
                "**9. /delete-user - This command is used to delete a user from the discord bot. You can only use this command on yourself**",
                "**10. /hello-world - Generates a nice hello world message with instructions on how to get started (generating this 'help' list)**",
                "**11. /help - Generates this same list again!**"
            ];
            await interaction.reply({content:`**Available Commands:**\n${commands_list_strings.join('\n')}`,ephemeral:true});
        }
    }
    return generate_help_message;
}