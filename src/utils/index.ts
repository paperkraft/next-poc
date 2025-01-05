export function getLocalTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: true });
}

export function getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function getFormattedDateTime(date:Date): string {
    return `${getFormattedDate(date)}, ${getLocalTime(date)}`
}