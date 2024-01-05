import IDiscordDatabaseResponse from "./IDiscordDatabaseResponse";

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