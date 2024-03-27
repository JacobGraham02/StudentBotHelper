import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { google } from "googleapis";
import IOAuth2 from "./interfaces/IOAuth2";
import { DiscordBotCommandType } from "../database/MongoDB/types/DiscordBotCommandType";

export default class CommandRequestEmail {

    public async sendEmail(createEmailRequest: DiscordBotCommandType) {
        try {
            const mailOptions = {
                from: process.env.google_admin_email,
                to: process.env.google_admin_email,
                subject: `Create command request for bot ${createEmailRequest.botId}: ${createEmailRequest.commandName}`,
                text: `The user wants to create a command with the following properties:\n\n Command name: ${createEmailRequest.commandName}\n\n Description: ${createEmailRequest.commandDescription}\n\n Command users: ${createEmailRequest.commandAuthorizedUsers}\n\n Functionality for command: ${createEmailRequest.commandDescriptionForFunction}\n\n. The bot id is: ${createEmailRequest.botId}\n The bot guild id is: ${createEmailRequest.botGuildId}`,
            }
            let emailTransporter = await this.createOAuth2Transporter();
            const response = await emailTransporter.sendMail(mailOptions);
            return response;
        } catch (error) {
            console.log(`There was an error when attempting to send the email to a gmail account: ${error}`);
            throw new Error(`There was an error when attempting to send the email to a gmail account: ${error}`);
        }
    }

    private async createOAuth2Transporter(): Promise<any> {
        const OAuth2 = google.auth.OAuth2;

        try {
            const oauth2Client = new OAuth2(
                process.env.google_cloud_client_id,
                process.env.google_cloud_client_secret,
                process.env.google_cloud_redirect_uri
            )

            oauth2Client.setCredentials({
                refresh_token: process.env.google_cloud_refresh_token
            });

            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((error, token) => {
                    if (error) {
                        console.log(`There was an error when attempting to set the gmail account credentials: ${error}`);
                        reject(error);
                    }
                    resolve(token);
                });
            });

            const emailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.google_admin_email,
                    accessToken,
                    clientId: process.env.google_cloud_client_id,
                    clientSecret: process.env.google_cloud_client_secret,
                    refreshToken: process.env.google_cloud_refresh_token
                } as IOAuth2
            });
            return emailTransporter;
        } catch (error) {
            console.log(`There was an error when attempting to create an OAuth2 transporter object: ${error}`);
            throw new Error(`There was an error when attempting to create an OAuth2 transporter object: ${error}`);
        }
    }
}

