import { describe, it, expect } from "vitest";
import { FEATURE_FLAGS } from "./feature-flags";

describe("FEATURE_FLAGS", () => {
    it("exports feature flag constants", () => {
        expect(FEATURE_FLAGS).toHaveProperty("PAX_ENABLED");
        expect(FEATURE_FLAGS).toHaveProperty("WORK_RUN_ENABLED");
        expect(FEATURE_FLAGS).toHaveProperty("TROPHIES_ENABLED");
    });

    it("has correct PAX_ENABLED key", () => {
        expect(FEATURE_FLAGS.PAX_ENABLED).toBe("feature.liveTiming.paxEnabled");
    });

    it("has correct WORK_RUN_ENABLED key", () => {
        expect(FEATURE_FLAGS.WORK_RUN_ENABLED).toBe(
            "feature.liveTiming.workRunEnabled"
        );
    });

    it("has correct TROPHIES_ENABLED key", () => {
        expect(FEATURE_FLAGS.TROPHIES_ENABLED).toBe(
            "feature.liveTiming.trophiesEnabled"
        );
    });

    it("has readonly values", () => {
        // as const makes values readonly, but doesn't freeze the object
        expect(FEATURE_FLAGS.PAX_ENABLED).toBe("feature.liveTiming.paxEnabled");
        expect(FEATURE_FLAGS.WORK_RUN_ENABLED).toBe(
            "feature.liveTiming.workRunEnabled"
        );
        expect(FEATURE_FLAGS.TROPHIES_ENABLED).toBe(
            "feature.liveTiming.trophiesEnabled"
        );
    });
});
