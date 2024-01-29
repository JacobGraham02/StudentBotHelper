import { Request, Response } from 'express';
import { GooglePlacesService } from './GooglePlacesService';
import IGooglePlacesResponse from './IGooglePlacesResponse';

export class GooglePlacesApiController {
    findPlaceFromText(request: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>) {
        throw new Error("Method not implemented.");
    }

    private google_places_service: GooglePlacesService;

    constructor(api_key: string) {
        this.google_places_service = new GooglePlacesService(api_key);
    }

    public async findPlaceFromGooglePlacesApi(request: Request, response: Response) {
        try {
            const places_input: string = request.query.input as string;

            if (!places_input) {
                response.status(400).json({error:'Input parameter is required'});
                return;
            }

            const data = await this.google_places_service.findPlaceFromText(places_input);
            response.json(data);
            return data;
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                response.status(500).json({error: error.message});
            } else {
                response.status(500).json({error: 'An unknown error has occurred'});
            }
        }
    }
}