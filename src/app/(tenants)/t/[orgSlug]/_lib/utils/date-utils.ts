/**
 * Formats a date string to a human-readable format
 * Handles date strings in YYYY-MM-DD format without timezone issues
 */
export function formatDate(dateString: string): string {
    // Parse date string to avoid timezone issues
    // If the string is in YYYY-MM-DD format, parse it as local date
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const year = parseInt(parts[0]!, 10);
        const month = parseInt(parts[1]!, 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]!, 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
    // Fallback to standard Date parsing for other formats
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Checks if an event is a single day event
 */
export function isSingleDay(start: string, end: string): boolean {
    return start === end;
}
