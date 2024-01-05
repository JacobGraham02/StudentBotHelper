export function formatDatetimeValue(mysql_date_time_value: string) {
    const date = new Date(mysql_date_time_value);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'});
}

export function formatTimeValue(mysql_time_value: string) {
    const date = new Date(`1970-01-01 ${mysql_time_value}`);
    return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
}