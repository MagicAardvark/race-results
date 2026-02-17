const DATE_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
};

/**
 * Formats a date string to a human-readable format (e.g. "Thu, June 10, 2024")
 * Handles date strings in YYYY-MM-DD format without timezone issues
 */
export function formatDate(dateString: string): string {
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const year = parseInt(parts[0]!, 10);
        const month = parseInt(parts[1]!, 10) - 1;
        const day = parseInt(parts[2]!, 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString("en-US", DATE_DISPLAY_OPTIONS);
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", DATE_DISPLAY_OPTIONS);
}

/**
 * Checks if an event is a single day event
 */
export function isSingleDay(start: string, end: string): boolean {
    return start === end;
}

/**
 * Returns YYYY-MM-DD for a Date (local time) or preserves API date strings
 */
export function getDateString(d: Date | string): string {
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        return d;
    }
    const date = typeof d === "string" ? new Date(d) : d;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * Formats a date range for display (single day or "Start – End")
 */
export function formatDateRange(
    start: Date | string,
    end: Date | string
): string {
    const startStr = getDateString(start);
    const endStr = getDateString(end);
    const startFormatted = formatDate(startStr);
    if (startStr === endStr) return startFormatted;
    return `${startFormatted} – ${formatDate(endStr)}`;
}
