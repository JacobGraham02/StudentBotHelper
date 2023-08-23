import IEventEmitterResponse from './IEventEmitterResponse';

export default function formatValidJsonResponse(response_status: number, response_text: string):IEventEmitterResponse {
    const formatted_object = {
        status: response_status,
        statusText: response_text
    }
    return { response_json: JSON.stringify(formatted_object)};
}