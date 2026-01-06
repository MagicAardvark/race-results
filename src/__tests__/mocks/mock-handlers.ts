import { http, HttpResponse } from "msw";
import { mockPaxResults } from "./mock-pax-results";
import { mockClassResults } from "./mock-class-results";
import { mockRawResults } from "./mock-raw-results";
import { mockRunWork } from "./mock-run-work";
import { LIVE_TIMING_CONFIG } from "@/app/(tenants)/t/[orgSlug]/live/_lib/config/config";

// Mock API handlers for MSW
export const handlers = [
    // Live timing API endpoints - use environment variables from config
    http.get(LIVE_TIMING_CONFIG.api.classResults, () => {
        return HttpResponse.json(mockClassResults);
    }),

    http.get(LIVE_TIMING_CONFIG.api.paxResults, () => {
        return HttpResponse.json(mockPaxResults);
    }),

    http.get(LIVE_TIMING_CONFIG.api.rawResults, () => {
        return HttpResponse.json(mockRawResults);
    }),

    http.get(LIVE_TIMING_CONFIG.api.runWork, () => {
        return HttpResponse.json(mockRunWork);
    }),

    // Organization API
    http.get("*/api/organizations", () => {
        return HttpResponse.json([
            {
                orgId: "org-1",
                name: "Test Organization",
                slug: "test-org",
            },
        ]);
    }),

    // Feature flags API
    http.get("*/api/feature-flags", () => {
        return HttpResponse.json({
            "feature.liveTiming.paxEnabled": true,
            "feature.liveTiming.workRunEnabled": true,
        });
    }),
];
