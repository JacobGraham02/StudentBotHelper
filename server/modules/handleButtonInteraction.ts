import { ButtonInteraction, CacheType, GuildMember, Role, User, escapeHeading } from "discord.js";

/**
 * If a button is interacted with by a Discord user, the caller function will await a response on what to do if the button has a custom id equal to 'assign_bot_role_button'.
 * The following function will attempt to find a specific role from the target Discord server and assign it to whichever user clicked the caller button in Discord.
 * This function attempts to locate the role 'bot user' in the Discord server and assign that role to the list of roles that the user already has
 * @param interaction ButtonInteraction<CacheType> the interaction is of this type because all of the interaction data that was captured when the user clicked the button
 * is necessary when changing the profile of a user
 * @returns Promise<void>
 */
export default async function handleButtonInteraction(interaction: ButtonInteraction<CacheType>): Promise<void> {
    const bot_role = `Bot user`;
    if (interaction.customId === `assign_bot_role_button`) {

        if (!interaction.member || !interaction.member.roles) {
           await interaction.reply({content: `The Discord member that clicked this button is null. Please inform the server administrator of this error`});
           return;
        }
        if (!interaction.guild) {
            await interaction.reply({content: `The guild that the Discord member is a part of is null. Please inform the server administrator of this error`});
            return;
        }
        const interaction_user = interaction.member as GuildMember;
        
        try {
            const bot_user_role: Role | undefined = interaction.guild.roles.cache.find(role => role.name === `${bot_role}`);

            if (bot_user_role) {
                await interaction_user.roles.add(bot_user_role);
                await interaction.reply({content: `You have been given the role ${bot_user_role}`, ephemeral: true});
            } else {
                await interaction.reply({content:`The role '${bot_role}' could not be found in Discord. Please contact your server administrator and inform them of this error`, ephemeral:true});
            }
        } catch (error) {
            console.error(`There was an error assigning the bot user role: ${error}`);
            await interaction.reply({content:`There was an error when assigning the bot user role to you. Please contact your server administrator and inform them of this 
                error`, ephemeral: true});
            throw error;
        }
    } 
}