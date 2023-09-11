import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";

export default interface DiscordEventData {
    start_date: string;
    end_date: string;
    name: string;
    description: string;
    privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly,
    entity_type: GuildScheduledEventEntityType.External,
    entity_meta_data: {
        location: string;
    }
}