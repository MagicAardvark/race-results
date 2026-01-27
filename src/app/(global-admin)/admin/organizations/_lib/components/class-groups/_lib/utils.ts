/**
 * Converts a string to Title Case
 * Example: "super street modified" -> "Super Street Modified"
 */
export function toTitleCase(str: string): string {
    return str
        .trim()
        .toLowerCase()
        .split(/\s+/) // Split on one or more whitespace characters
        .filter((word) => word.length > 0) // Filter out empty strings from multiple spaces
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Converts a string to uppercase
 * Example: "ssm" -> "SSM"
 */
export function toUpperCase(str: string): string {
    return str.trim().toUpperCase();
}
