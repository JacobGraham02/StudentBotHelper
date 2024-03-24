import { SlashCommandBuilder, User } from 'discord.js';
import { randomUUID } from 'crypto';
import BotRepository from '../database/MongoDB/BotRepository';
import { hashPassword } from '../modules/hashAndValidatePassword';
import { DiscordBotInformationType } from '../database/MongoDB/types/DiscordBotInformationType';

export default function() {
    const create_new_user_object: Object = {
        data: new SlashCommandBuilder()
            .setName('create-website-user')
            .setDescription('Use this command to create a new user that will allow a user to log in to the website')
            .addStringOption(options =>
                options.setName('username')
                .setDescription('(Required) your username')
                .setRequired(true))
            .addStringOption(options =>
                options.setName('password')
                .setDescription('(Required) your password')
                .setRequired(true)
            )
            .addStringOption(options =>
                options.setName(`userid`)
                .setDescription(`(Required) user id`)
                .setRequired(true)
            ),
            
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            const bot_repository: BotRepository = new BotRepository();
            const student_username = interaction.options.getString('username');
            const student_password = interaction.options.getString('password');
            const discord_user_id = interaction.options.getString('userid');
            const student_for_database_password_object = hashPassword(student_password);

            const student_object: DiscordBotInformationType = {
                bot_id: discord_user_id,
                bot_username: student_username,
                bot_password: student_for_database_password_object.hash,
            }

            try {
                await bot_repository.createBot(student_object);
                await interaction.reply({content:`An account has been created for you. Remember to save your login credentials somewhere safe`,ephemeral: true});
            } catch (error) {
                await interaction.reply({content: `There was an error when attempting to create an account for a website user: ${error}`,ephemeral:true});
                throw new Error(`There was an error when attempting to create an account for a website user: ${error}`);
            }
        }
    }
    return create_new_user_object;
}