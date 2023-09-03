import IDiscordDatabaseResponse from "./IDiscordDatabaseResponse";

export default function formatValidDatabaseResponseObject(response_status: number, response_statusText: string): IDiscordDatabaseResponse {
    const discordjs_database_result_object = {
        status: response_status,
        statusText: response_statusText,
    };
    return discordjs_database_result_object;
}