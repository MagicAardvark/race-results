/**
 * Centralized configuration for live timing API endpoints
 */
export const LIVE_TIMING_CONFIG = {
    api: {
        classResults: process.env.CLASS_RESULTS_JSON_URL || "http://localhost:3000/api/results",
        paxResults: process.env.PAX_RESULTS_JSON_URL || "http://localhost:3000/api/pax-results",
        rawResults: process.env.RAW_RESULTS_JSON_URL || "http://localhost:3000/api/raw-results",
        runWork: process.env.RUN_WORK_JSON_URL || "http://localhost:3000/api/run-work",
    },
    defaults: {
        expectedRuns: parseInt(process.env.EXPECTED_RUNS || "4", 10),
        displayMode: "autocross" as const,
    },
} as const;

