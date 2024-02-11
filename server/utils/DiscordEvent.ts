import { Guild } from 'discord.js';
import IDiscordEventData from './IDiscordEventData';

export default class DiscordEvent  {
    target_discord_guild: Guild;

    constructor(discord_guild: Guild ) {
        this.target_discord_guild = discord_guild;
    }

    /**
     * Create a scheduled event given a Discord guild (server) information. We must create the scheduled event asychronously because 
     * the Discord API will throw an 'Unknown interaction' exception, because we did not await completion of the interaction (creating the scheduled event). 
     * @param discord_event_data IDiscordEventData containing all of the data required to create a scheduled event
     */
    async createNewDiscordEvent(discord_event_data: IDiscordEventData) {
        await this.target_discord_guild.scheduledEvents.create({
            name: discord_event_data.discord_event_data_class_name,
            scheduledStartTime: discord_event_data.scheduled_start_date,
            scheduledEndTime: discord_event_data.scheduled_end_date,
            description: discord_event_data.discord_event_data_class_code,
            entityType: discord_event_data.entityType,
            privacyLevel: discord_event_data.privacyLevel,
            entityMetadata: discord_event_data.entityMetadata
        });
    }
}