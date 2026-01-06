import { describe, it, expect } from "vitest";
import { generateApiKey } from "./generate-api-key";

describe("generateApiKey", () => {
    it("generates a string", () => {
        const key = generateApiKey();
        expect(typeof key).toBe("string");
    });

    it("generates keys with consistent prefix", () => {
        const key = generateApiKey();
        expect(key).toMatch(/^rr_api_key_/);
    });

    it("generates unique keys", () => {
        const key1 = generateApiKey();
        const key2 = generateApiKey();
        expect(key1).not.toBe(key2);
    });

    it("generates keys of reasonable length", () => {
        const key = generateApiKey();
        expect(key.length).toBeGreaterThan(20);
    });

    it("generates keys with alphanumeric characters", () => {
        const key = generateApiKey();
        // Should contain alphanumeric characters after prefix
        const suffix = key.replace("rr_api_key_", "");
        expect(suffix).toMatch(/^[a-zA-Z0-9]+$/);
    });
});
