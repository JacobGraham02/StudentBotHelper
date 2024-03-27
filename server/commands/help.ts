import { SlashCommandBuilder } from 'discord.js';

export default function() {
    const generate_help_message_object: Object = {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Lists all available bot commands'),
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {   
            const command_list: string[] = [
                "**Admin specific commands:**",
                "**1. /create-website-user - Creates a website user that will be able to log into the bot website and customize their own Discord bot**",
                "**2. /delete-website-user - Deletes a website user**",
                "**3. /create-bot-role-button - Adds a button which allows users to grant themselves access to using bot commands**",
                "**4. /change-bot-username - Changes the username of the bot (rate limited to twice per hour)**",
                "**Regular user commands:**",
                "**1. /help - Generates this same list of commands again**",
                "**2. /hello-world - Generates a nice 'hello world' message with instructions on how to get started using the bot**",
                "**3. /create-dm-group - Creates a private DM (Direct Message) group between yourself and up to three others**",
                "**4. /create-thread - Creates private thread for yourself**",
                "**5. /create-voice-channel - Creates a public voice channel**",
                "**6. /create-class - Creates a class that is running this semester**",
                "**7. /create-class-work - Creates a work item that can be assigned to a class**",
                "**8. /create-scheduled-event - Creates scheduled events in Discord that globally inform users of the classes occurring on that day**",
                "**9. /show-classes - Generates a list of all the details for classes which are occurring this semester**",
            ]; 
            try {
                await interaction.reply({content:`**Available Commands:**\n${command_list.join('\n')}`,ephemeral:true});
            } catch (error) {
                await interaction.reply({content:`There was an error when writing the list of available commands to Discord`,ephemeral:true});
            }
        }
    }
    return generate_help_message_object;
}