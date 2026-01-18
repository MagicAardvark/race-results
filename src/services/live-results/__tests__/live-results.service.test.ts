import { describe, it, expect, vi, beforeEach } from "vitest";
import { LiveResultsSnapshot } from "@/dto/live-results/ingest";

vi.mock("@/services/events/events.service");
vi.mock("@/services/class-configuration/class-configuration.service");
vi.mock("@/lib/cache/app-cache");
vi.mock("@/services/live-results/lib/live-results-parser", () => ({
    LiveResultsParser: function () {
        return {
            buildResults: vi.fn().mockResolvedValue({
                classResults: [],
                indexedResults: [],
                rawResults: [],
            }),
        };
    },
}));

import { liveResultsService } from "../live-results.service";
import { eventsService } from "@/services/events/events.service";
import { appCache } from "@/lib/cache/app-cache";
import { classConfigurationService } from "@/services/class-configuration/class-configuration.service";
import { getCacheKey } from "@/services/live-results/lib/util";

const mockSnapshot: LiveResultsSnapshot = [
    {
        msrId: "",
        email: "",
        class: "as",
        carNumber: "23",
        driverName: "Test Driver",
        carModel: "Test Car",
        carColor: "Blue",
        sponsor: "",
        runs: [[[50.0, 0, "clean"]]],
    },
];

describe("LiveResultsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(eventsService.getEventConfiguration).mockResolvedValue({
            scoringMode: "singlebest",
            conePenaltyInSeconds: 2,
            trophyConfiguration: { mode: "percentage", value: 33 },
        });
        vi.mocked(classConfigurationService.getClassesForOrg).mockResolvedValue(
            new Map()
        );
    });

    describe("processAndUpdateCache", () => {
        it("caches results with correct keys and expiration", async () => {
            const timestamp = new Date("2024-10-10T12:00:00Z");

            await liveResultsService.processAndUpdateCache(
                "test-org",
                mockSnapshot,
                timestamp
            );

            expect(appCache.set).toHaveBeenCalledTimes(3);

            const cacheKeys = vi
                .mocked(appCache.set)
                .mock.calls.map((call) => call[0]);

            expect(cacheKeys).toContain(
                getCacheKey("test-org", "classResults")
            );
            expect(cacheKeys).toContain(
                getCacheKey("test-org", "indexedResults")
            );
            expect(cacheKeys).toContain(getCacheKey("test-org", "rawResults"));

            // Verify expiration is 24 hours
            expect(vi.mocked(appCache.set).mock.calls[0][2]).toBe(86400);
        });
    });
});
