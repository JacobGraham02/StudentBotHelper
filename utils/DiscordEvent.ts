import { Guild } from 'discord.js';
import IDiscordEvent from './IDiscordEventData';

export default class DiscordEvent  {
    target_discord_guild: Guild;
    target_discord_event_data: IDiscordEvent;

    constructor(discord_event_data: IDiscordEvent, discord_guild: Guild ) {
        this.target_discord_guild = discord_guild;
        this.target_discord_event_data = discord_event_data;
    }

    async createNewDiscordEvent() {
        await this.target_discord_guild.scheduledEvents.create({
            description: this.target_discord_event_data.description,
            name: this.target_discord_event_data.name,
            privacyLevel: this.target_discord_event_data.privacy_level,
            scheduledStartTime: this.target_discord_event_data.start_date,
            scheduledEndTime: this.target_discord_event_data.end_date,
            entityType: this.target_discord_event_data.entity_type,
            entityMetadata: this.target_discord_event_data.entity_meta_data
        });
    }
}