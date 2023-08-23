import Student from "../entity/Student";

export default function formatValidJsonResponse(response_status: number, response_statusText: string, user_data?: Student):string {
    const formatted_object = {
        status: response_status,
        statusText: response_statusText,
        data: user_data ? user_data.toJsonSafe() : undefined
    }
    return JSON.stringify(formatted_object);
}