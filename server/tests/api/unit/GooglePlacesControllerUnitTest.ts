import { GooglePlacesApiController } from "../../../api/GooglePlaces/GooglePlacesController";
import { GooglePlacesService } from "../../../api/GooglePlaces/GooglePlacesService";
import { Request, Response } from 'express';

// Mock the GooglePlacesService module to avoid real interactions
jest.mock('../../../api/GooglePlaces/GooglePlacesService');

// Group related tests for the GooglePlacesApiController
describe('GooglePlacesApiController', () => {
    let mock_api_key: string;
    let controller: GooglePlacesApiController;
    if (process.env.google_cloud_api_key) {
        mock_api_key = process.env.google_cloud_api_key;  
    } else {
        mock_api_key = 'test_api_key';
    }

    // Sample mock data for simulating the expected response from the Google Places API
    const mock_data = {
        candidates: [
            [
                {
                  "formatted_address": "140 George St, The Rocks NSW 2000, Australia",
                  "geometry":
                    {
                      "location": { "lat": -33.8599358, "lng": 151.2090295 },
                      "viewport":
                        {
                          "northeast":
                            { "lat": -33.85824377010728, "lng": 151.2104386798927 },
                          "southwest":
                            { "lat": -33.86094342989272, "lng": 151.2077390201073 },
                        },
                    },
                  "name": "Museum of Contemporary Art Australia",
                  "opening_hours": { "open_now": false || true },
                  "rating": 4.4,
                },
              ]
        ],
        status: "OK"
    };

    // Before each test, clear any previous mock implementation and initialize the controller
    beforeEach(() => {
        (GooglePlacesService as jest.Mock).mockClear();
        controller = new GooglePlacesApiController(mock_api_key);
    });

    // Test that the controller returns the expected places data for a valid input
    it('should respond with places data for valid input', async () => {
        // Create a mock request with a sample input query
        const req = {
            query: {
                input: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${mock_api_key}`
            }
        } as unknown as Request;

        // Create a mock response object with jest functions to simulate Express.js response
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        // Mock the findPlaceFromText method to return our mock data
        (GooglePlacesService.prototype.findPlaceFromText as jest.Mock).mockResolvedValue(mock_data);

        // Execute the method we're testing
        await controller.findPlaceFromGooglePlacesApi(req, res);

        // Check that the response contains our mock data
        expect(res.json).toHaveBeenCalledWith(mock_data);
    });

    // Test the scenario where the input is missing
    it('should respond with 400 status for missing input', async () => {
        // Create a mock request without the input query
        const req = {
            query: {}
        } as unknown as Request;

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await controller.findPlaceFromGooglePlacesApi(req, res);

        // Check that the response has a status of 400 and the expected error message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Input parameter is required' });
    });

    // Test the scenario where the service throws an error
    it('should respond with 500 status for service error', async () => {
        const req = {
            query: {
                input: 'test-query'
            }
        } as unknown as Request;

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        const error_message = 'Service Error';

        // Mock the findPlaceFromText method to reject with an error
        (GooglePlacesService.prototype.findPlaceFromText as jest.Mock).mockRejectedValue(new Error(error_message));

        await controller.findPlaceFromGooglePlacesApi(req, res);

        // Check that the response has a status of 500 and the expected error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: error_message });
    });
});
