import IDiscordDatabaseResponse from "./IDiscordDatabaseResponse";

/**
 * We must properly format an Object for use in the application by taking the raw database response and database respones status, and packaging them into an object.
 * 
 * @param response_statusText string that holds the database response message
 * @param response_status optional number that holds the database response status (200, 404, 500, etc.). This is a custom implementation that is more in line with traditional
 * http response codes.
 * @returns IDiscordDatabaseResponse Object instance with the database operation response and status packaged inside
 */
export function formatValidDatabaseResponseObject(response_statusText: string, response_status?: number): IDiscordDatabaseResponse {
    if (response_status === undefined) {
        response_status === 'No response status number';
    }
    const discordjs_database_result_object = {
        status: response_status,
        statusText: response_statusText,
    };
    return discordjs_database_result_object;
}