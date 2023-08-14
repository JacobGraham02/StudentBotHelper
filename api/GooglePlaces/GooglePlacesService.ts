import https from 'https';
import IGooglePlacesResponse from './IGooglePlacesResponse';
import axios from 'axios';

export class GooglePlacesService {
  private api_key:string;
  private base_url = "https://maps.googleapis.com/maps/api/place";

  constructor(api_key: string) {
    this.api_key = api_key;
  }

  async findPlaceFromText(input: string): Promise<IGooglePlacesResponse> {
    // Create the API URL dynamically based on the input
    const google_places_api_url = `${this.base_url}/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=textquery&fields=formatted_address,name,rating,opening_hours,geometry&key=${this.api_key}`;

    try {
      const response = await axios.get(google_places_api_url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}