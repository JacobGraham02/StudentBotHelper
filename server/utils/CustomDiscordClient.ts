import { Client, Collection } from 'discord.js';

/**
 * Custom discord client to make compatible with the commands that I wish to populate the Discord bot with
 */
export default class CustomDiscordClient extends Client {
    discord_commands: Collection<any, any>
    constructor(options) {
        super(options);
        this.discord_commands = new Collection();
    }
}