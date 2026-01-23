/**
 * Creates a unique key for a driver entry (for React keys)
 * Uses hyphens for readability in component keys
 */
export function createDriverKey(
    name: string,
    number: string,
    carClass: string
): string {
    return `${name}-${number}-${carClass}`;
}
