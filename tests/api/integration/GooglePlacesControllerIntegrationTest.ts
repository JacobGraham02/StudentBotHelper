require('dotenv').config();
import { Request, Response } from "express";
import { GooglePlacesApiController } from "../../../api/GooglePlaces/GooglePlacesController";

describe('GooglePlacesApiController Integration Test', () => {
    let api_key: string = '';
    
    let controller: GooglePlacesApiController;
    if (process.env.google_cloud_api_key) {
        api_key = process.env.google_cloud_api_key;  
    } 

    const json_places_api_test_data = {
            "candidates":
              [
                {
                  "formatted_address": "220 E Chicago Ave, Chicago, IL 60611, United States",
                  "geometry":
                    {
                      "location": { "lat": 41.8972114, "lng": -87.6209882 },
                      "viewport":
                        {
                          "northeast":
                            { "lat": 41.89857557989272, "lng": -87.61938285000001 },
                          "southwest":
                            { "lat": 41.89587592010728, "lng": -87.62265024999998 },
                        },
                    },
                  "name": "Museum Of Contemporary Art Chicago",
                  "opening_hours": { "open_now": false },
                  "rating": 4.4,
                },
              ],
            "status": "OK",
          }

    beforeEach(() => {
        controller = new GooglePlacesApiController(api_key);
        jest.clearAllMocks();
    });

    it('should respond with the real place for the Museum of Contemporary Art Australia', async() => {
        const request = {
            query: {
                input: 'Museum of Contemporary Art Australia'
            }
        } as unknown as Request;
    
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
    
        const google_places_api_result = await controller.findPlaceFromGooglePlacesApi(request, response);

        expect(response.json).toHaveBeenCalled();
        expect(google_places_api_result).toEqual(json_places_api_test_data);
    });
});