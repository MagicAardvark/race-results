import { prependEnvironment } from "@/lib/cache/lib";
import { describe, expect, it } from "vitest";

describe("prependEnvironment", () => {
    it("should prepend environment to key with colon separator", () => {
        expect(prependEnvironment("production", "user:123")).toBe(
            "production:user:123"
        );
    });

    it("should handle development environment", () => {
        expect(prependEnvironment("development", "session:abc")).toBe(
            "development:session:abc"
        );
    });

    it("should handle simple keys", () => {
        expect(prependEnvironment("test", "mykey")).toBe("test:mykey");
    });

    it("should handle empty key", () => {
        expect(prependEnvironment("production", "")).toBe("production:");
    });

    it("should handle keys with special characters", () => {
        expect(prependEnvironment("staging", "cache:org-123:data")).toBe(
            "staging:cache:org-123:data"
        );
    });

    it("should handle keys with spaces", () => {
        expect(prependEnvironment("dev", "my key with spaces")).toBe(
            "dev:my key with spaces"
        );
    });
});
