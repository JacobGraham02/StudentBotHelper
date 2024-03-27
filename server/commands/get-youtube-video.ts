import { SlashCommandBuilder } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from "dotenv";
import "dotenv/config";
dotenv.config({ path: "../../.env" });

export default function() {
    const find_youtube_videos_object: Object = {
        data: new SlashCommandBuilder()
            .setName('search-youtube')
            .setDescription('Use this command to search for a video on YouTube by using keywords')
            .addStringOption(options =>
                options.setName('youtube-video-title-keywords')
                .setDescription('(Required) youtube video title keywords')
                .setRequired(true)
            ),
            
        authorization_role_name: ["Discord admin", "Bot user"],

        async execute(interaction) {
           const youtube_data_api_key: string | undefined = process.env.youtube_data_api_key;
           const youtube_video_title_keywords: string | undefined = interaction.options.getString('youtube-video-title-keywords');
           const maximum_video_responses: number = 5;

           if (!youtube_data_api_key) {
                await interaction.reply({content:`The YouTube data API key is undefined. Please contact the site administrator and inform them of this error`,ephemeral:true});
                return;
           }
           if (!youtube_video_title_keywords) {
                await interaction.reply({content:`The YouTube video title is undefined. Please contact the site adminstrator and inform them of this error`,ephemeral:true});
                return;
           }
           const youtube_api_url = `https://www.googleapis.com/youtube/v3/search?maxResults=${maximum_video_responses}&q=${encodeURIComponent(youtube_video_title_keywords)}&key=${youtube_data_api_key}&part=snippet&type=video`;

           try {
                const youtube_api_response: AxiosResponse = await axios.get(youtube_api_url);
                const youtube_api_response_items: any[] = youtube_api_response.data.items;

                if (youtube_api_response_items.length > 0) {
                    const youtube_video_links: string = youtube_api_response_items.map(youtube_api_response_items => `https://www.youtube.com/watch?v=${youtube_api_response_items.id.videoId}`).join('\n');
                    await interaction.reply({content:`Here are the YouTube videos that I could find matching your search: \n${youtube_video_links}`,ephemeral:true});
                } else {
                    await interaction.reply({content:`There were no videos found for your given keywords`,ephemeral:true});
                    return;
                }
           } catch (error) {
                await interaction.reply({content:`There was an error when searching the YouTube data API for videos. Please contact the site administrator and inform them of this error: ${error}`,ephemeral:true});
                throw error;
           }
        }
    }
    return find_youtube_videos_object
}