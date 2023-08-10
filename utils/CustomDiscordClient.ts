import { Client, Collection } from 'discord.js';

export default class CustomDiscordClient extends Client {
    discord_commands: Collection<any, any>
    constructor(options) {
        super(options);
        this.discord_commands = new Collection();
    }
}