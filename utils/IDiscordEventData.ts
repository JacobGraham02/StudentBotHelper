import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";

/**
 * An interface defining the data that is used for creating Discord scheduled event data. 
 */
export default interface DiscordEventData {
    discord_event_data_class_name: string;
    scheduled_start_date: Date;
    scheduled_end_date: Date;
    discord_event_data_class_code: string;
    entityType: GuildScheduledEventEntityType,
    privacyLevel: GuildScheduledEventPrivacyLevel,
    entityMetadata: {
        location: string;
    }
}