
/**
 * Takes a string value that is retrieved from a Discord interaction 'options.getString' value and normalizes the date for use with the Discord API. We will strip the date so
 * that only the month, day, hour, and minute are returned in a string. Also can be used for MySQL DATETIME values to achieve the same result. 
 * @param mysql_date_time_value a string from the 'options.getString' value in a given Discord command.
 * @returns a string that is formatted to only include the month, day, hour, and minute from a javascript Date object. 
 */
export function formatDatetimeValue(mysql_date_time_value: string) {
    const date = new Date(mysql_date_time_value);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'});
}

/**
 * Takes a string value that indicates the current TIME value in the mysql database and normalizes it to only include the hour and minute, not the seconds. 
 * Appends the minimum date that can be given to a MySQL TIME value to construct a valid Date string. 
 * @param mysql_time_value 
 * @returns 
 */
export function formatTimeValue(mysql_time_value: string) {
    const date = new Date(`1970-01-01 ${mysql_time_value}`);
    return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
}