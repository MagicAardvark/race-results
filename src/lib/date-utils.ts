const DATE_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
};

/**
 * Parses a date string to a local Date. Prefer YYYY-MM-DD to avoid timezone shifts.
 */
function parseToDate(dateString: string): Date {
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const year = parseInt(parts[0]!, 10);
        const month = parseInt(parts[1]!, 10) - 1;
        const day = parseInt(parts[2]!, 10);
        return new Date(year, month, day);
    }
    return new Date(dateString);
}

/**
 * Formats a date string to a human-readable format (e.g. "Thu, June 10, 2024")
 * Handles date strings in YYYY-MM-DD format without timezone issues
 */
export function formatDate(dateString: string): string {
    return parseToDate(dateString).toLocaleDateString(
        "en-US",
        DATE_DISPLAY_OPTIONS
    );
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
    const [startFormatted, endFormatted] = [startStr, endStr].map(formatDate);
    return startStr === endStr
        ? startFormatted
        : `${startFormatted} – ${endFormatted}`;
}

const DATE_AND_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
};

/**
 * Formats a Date for display with date and time (e.g. "Jan 15, 2024, 2:30 PM")
 */
export function formatWithDateAndTime(date: Date): string {
    return new Intl.DateTimeFormat("en-US", DATE_AND_TIME_OPTIONS).format(date);
}

/**
 * Returns the effective date range for a calendar year in EST (Jan 1 00:00:00 – Dec 31 23:59:59).
 * Used for class index values and other year-bounded effective dates.
 */
export function getEffectiveDateRangeForYear(year: number): {
    effectiveFrom: Date;
    effectiveTo: Date;
} {
    const effectiveFrom = new Date(`${year}-01-01T00:00:00-05:00`);
    const effectiveTo = new Date(`${year}-12-31T23:59:59-05:00`);
    return { effectiveFrom, effectiveTo };
}
