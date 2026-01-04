import type { ClassResult, RawResult } from "../types";

/**
 * Generate a unique key for a ClassResult entry
 */
export function getClassResultKey(entry: ClassResult, className?: string): string {
    return className
        ? `${className}-${entry.position}-${entry.number}-${entry.name}`
        : `${entry.paxPosition}-${entry.position}-${entry.number}-${entry.name}`;
}

/**
 * Generate a unique key for a RawResult entry
 */
export function getRawResultKey(entry: RawResult): string {
    return `${entry.position}-${entry.entryInfo.number}-${entry.entryInfo.name}`;
}

