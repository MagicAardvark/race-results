import { http, HttpResponse } from "msw";
import { mockPaxResults } from "./mock-pax-results";
import { mockClassResults } from "./mock-class-results";
import { mockRawResults } from "./mock-raw-results";
import { mockRunWork } from "./mock-run-work";
import { LIVE_TIMING_CONFIG } from "@/app/(tenants)/t/[orgSlug]/live/_lib/config/config";

// Mock API handlers for MSW
export const handlers = [
    // Live timing API endpoints - use getApiUrl from config
    http.get(LIVE_TIMING_CONFIG.getApiUrl("test-org", "class"), () => {
        return HttpResponse.json(mockClassResults);
    }),

    http.get(LIVE_TIMING_CONFIG.getApiUrl("test-org", "indexed"), () => {
        return HttpResponse.json(mockPaxResults);
    }),

    http.get(LIVE_TIMING_CONFIG.getApiUrl("test-org", "raw"), () => {
        return HttpResponse.json(mockRawResults);
    }),

    http.get(LIVE_TIMING_CONFIG.getApiUrl("test-org", "runwork"), () => {
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
