import { Request, Response } from 'express';
import { GoogleDirectionsService } from './GoogleDirectionsService';
import ILocation from './ILocation';
import IDirectionsResponse from './IDirectionsResponse';

export class GoogleDirectionsController {
  private google_directions_service: GoogleDirectionsService;

  constructor(api_key: string) {
    this.google_directions_service = new GoogleDirectionsService(api_key);
  }

  async getDirections(req: Request, res: Response) {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required parameters' });
    }

    try {
      const directions_data: IDirectionsResponse = await this.google_directions_service.getDirections(
        origin as string,
        destination as string
      );
      res.json(directions_data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching directions' });
    }
  }

  async generateGoogleMapsUri(req: Request, res: Response) {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required parameters' });
    }

    try {
      const google_maps_uri: string = await this.google_directions_service.generateGoogleMapsUri(
        origin as string,
        destination as string
      );
      res.json({ google_maps_uri });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while generating Google Maps URI' });
    }
  }
}
