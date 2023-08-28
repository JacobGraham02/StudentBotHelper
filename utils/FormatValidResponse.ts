import Student from "../entity/Student";
import IDiscordDatabaseResponse from "./IDiscordDatabaseResponse";

export default function formatValidDatabaseResponseObject(response_status: number, response_statusText: string, user_data?: Student): IDiscordDatabaseResponse {
    const discordjs_database_result_object = {
        status: response_status,
        statusText: response_statusText,
        data: user_data ? user_data.toJsonSafe() : undefined
    };
    return discordjs_database_result_object;
}