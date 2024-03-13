import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const instanceDiscordAPI = axios.create({
  baseURL: "https://discord.com/api/v10",
  timeout: 3000,
  headers: {
    "User-Agent": `DiscordBot (https://discord.com/api/v10, 10)`,
    Authorization: `Bot ${process.env.discord_bot_token}`,
    "Content-Type": "application/json",
  },
});
