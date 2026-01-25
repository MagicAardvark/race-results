/**
 * Configuration for live timing API endpoints
 *
 * Note: The live timing pages fetch data directly from liveResultsService, not from API routes.
 * This config is primarily used for:
 * - MSW test mocks (mock-handlers.ts)
 * - Reference for API route paths used by external clients
 *
 * API Routes (for external clients):
 * - /api/[orgSlug]/live/results/class - Class results
 * - /api/[orgSlug]/live/results/indexed - PAX (indexed) results
 * - /api/[orgSlug]/live/results/raw - Raw results
 * - /api/[orgSlug]/live/results/runwork - Work/run assignments
 */
export const LIVE_TIMING_CONFIG = {
    getApiUrl: (
        orgSlug: string,
        endpoint: "class" | "indexed" | "raw" | "runwork"
    ): string => {
        return `/api/${orgSlug}/live/results/${endpoint}`;
    },
} as const;
