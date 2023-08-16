import IGooglePlacesResponse from './IGooglePlacesResponse';
import axios from 'axios';
import ILocation from './ILocation';

export class GooglePlacesService {
  private api_key:string;
  private base_url:string = "https://maps.googleapis.com/maps/api/place";

  constructor(api_key: string) {
    this.api_key = api_key;
  }

  async findPlaceFromText(google_maps_place: string): Promise<IGooglePlacesResponse> {
    // Create the API URL dynamically based on the input
    const google_places_api_url:string = `${this.base_url}/findplacefromtext/json?input=${encodeURIComponent(google_maps_place)}&inputtype=textquery&fields=formatted_address,name,rating,opening_hours,geometry&key=${this.api_key}`;

    try {
      const response = await axios.get(google_places_api_url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findLatitudeAndLongitude(google_maps_place: IGooglePlacesResponse): Promise<ILocation> {
    if (google_maps_place.candidates.length > 0) {
      const geometry_of_place = google_maps_place.candidates[0].geometry;
      const location_of_place_lat_and_lng = geometry_of_place.location;
      const location_of_place_object = {
        lat: location_of_place_lat_and_lng.lat,
        lng: location_of_place_lat_and_lng.lng
      }
      return location_of_place_object;
    } else {
      throw new Error('No candidates found in the response');
    }
  }

  async generateGoogleMapsUri(google_maps_places_location: ILocation): Promise<string> {
    if (google_maps_places_location.lat && google_maps_places_location.lng) {
      const google_maps_place_latitude = google_maps_places_location.lat;
      const google_maps_place_longitude = google_maps_places_location.lng;
      const embedded_maps_url = `https://www.google.com/maps/?q=${google_maps_place_latitude},${google_maps_place_longitude}`;
      return embedded_maps_url;
    } else {
      throw new Error('No valid latitude or longitude was found in the response');
    }
  }
}