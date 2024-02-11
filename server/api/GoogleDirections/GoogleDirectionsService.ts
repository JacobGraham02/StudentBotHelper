import axios from 'axios';
import ILocation from './ILocation';
import IDirectionsResponse from './IDirectionsResponse';

export class GoogleDirectionsService {
    private api_key: string;
    private base_url: string = 'https://maps.googleapis.com/maps/api/directions/json';

    constructor(api_key: string) {
        this.api_key = api_key;
    }

    async getDirections(origin: string, destination: string): Promise<IDirectionsResponse> {
        const params = {
            origin,
            destination,
            key: this.api_key,
        };

        try {
            const response = await axios.get(this.base_url, { params });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async generateGoogleMapsUri(origin: string, destination: string): Promise<string> {
        try {
            const directionsData = await this.getDirections(origin, destination);
            const startLocation:ILocation = directionsData.routes[0].legs[0].start_location;
            const endLocation:ILocation = directionsData.routes[0].legs[0].end_location;

            if (startLocation && endLocation) {
                const startLat:number = startLocation.lat;
                const startLng:number = startLocation.lng;
                const endLat:number = endLocation.lat;
                const endLng:number = endLocation.lng;

                const googleMapsUri = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}`;
                return googleMapsUri;
            } else {
                throw new Error('Unable to determine locations from directions response');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
