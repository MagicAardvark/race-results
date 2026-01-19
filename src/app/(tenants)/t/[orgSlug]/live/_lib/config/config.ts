/**
 * Centralized configuration for live timing API endpoints
 *
 * Supports both local files (for development) and API routes (for production).
 *
 * Configuration:
 * - Set USE_LOCAL_FILES=true to use local JSON files from /datasets/live-results/live/results/
 * - Otherwise, data will be fetched from API routes: /api/[orgSlug]/live/results/*
 *
 * Environment Variables:
 * - USE_LOCAL_FILES: Set to "true" to use local files instead of API routes
 * - APP_URL: Base URL for the application (used for API route fetching in production)
 * - VERCEL_URL: Automatically set by Vercel (used as fallback if APP_URL not set)
 * - EXPECTED_RUNS: Expected number of runs per driver (default: 4)
 *
 * API Routes:
 * - /api/[orgSlug]/live/results/class - Class results
 * - /api/[orgSlug]/live/results/indexed - PAX (indexed) results
 * - /api/[orgSlug]/live/results/raw - Raw results
 * - /api/[orgSlug]/live/runwork - Work/run assignments
 *
 * Authentication:
 * - API routes use Clerk authentication via cookies
 * - Cookies are automatically forwarded when fetching from server components
 * - Local development always uses localhost:3000 to ensure cookies work
 */
export const LIVE_TIMING_CONFIG = {
    useLocalFiles: process.env.USE_LOCAL_FILES === "true",
    getApiUrl: (
        orgSlug: string,
        endpoint: "class" | "indexed" | "raw" | "runwork"
    ) => {
        if (LIVE_TIMING_CONFIG.useLocalFiles) {
            // Use local files for development
            const localPaths: Record<typeof endpoint, string> = {
                class: "/datasets/live-results/live/results/class.json",
                indexed: "/datasets/live-results/live/results/indexed.json",
                raw: "/datasets/live-results/live/results/raw.json",
                runwork: "/datasets/live-results/live/results/runwork.json",
            };
            return localPaths[endpoint];
        }
        // Use API routes for production
        return `/api/${orgSlug}/live/results/${endpoint === "runwork" ? "runwork" : endpoint}`;
    },
    defaults: {
        expectedRuns: parseInt(process.env.EXPECTED_RUNS || "4", 10),
        displayMode: "autocross" as const,
    },
} as const;
