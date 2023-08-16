import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({path: '../../.env'});
import { SlashCommandBuilder } from 'discord.js';
import { GooglePlacesService } from '../api/GooglePlaces/GooglePlacesService';
import IGooglePlacesResponse from '../api/GooglePlaces/IGooglePlacesResponse';
import ILocation from '../api/GooglePlaces/ILocation';

export default function() {
    const google_place_info_object: Object = {
        data: new SlashCommandBuilder()
        .setName('placeinfo')
        .setDescription('Retrieve a Google Maps link for a specific location')
        .addStringOption(option => 
            option.setName('google_maps_location')
            .setDescription('(Required) Name of the location to get info from')
            .setRequired(true)
        ),
        authorization_role_name: ["Discord admin"],

        async execute(interaction) {
            if (!process.env.google_cloud_api_key) {
                throw new Error(`An error has occurred when executing this command! Please try again, or inform your server bot developer that 'an environment variable is not valid'`);
            }
            const googlePlacesService: GooglePlacesService = new GooglePlacesService(process.env.google_cloud_api_key);
            const option_google_maps_location_name: string = interaction.options.getString('google_maps_location');

            try {
                const google_places_service_response: IGooglePlacesResponse = await googlePlacesService.findPlaceFromText(option_google_maps_location_name);
                const latitude_longitude_object: ILocation = await googlePlacesService.findLatitudeAndLongitude(google_places_service_response);
                const google_maps_link: string = await googlePlacesService.generateGoogleMapsUri(latitude_longitude_object);
                await interaction.reply({content: `A Google Maps link to your desired place has been generated: ${google_maps_link}`});
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'There was an error when fetching the Google Maps location. Please try again or enter a different location to search',ephemeral:true });
            }
        }
    };

    return google_place_info_object;
}

