import { describe, it, expect } from "vitest";
import { mask } from "./mask";

describe("mask", () => {
    it("masks middle characters with default settings", () => {
        const result = mask("rr_api_key_1234567890");
        expect(result.length).toBe("rr_api_key_1234567890".length);
        expect(result.startsWith("rr_a")).toBe(true);
        expect(result.endsWith("7890")).toBe(true);
        // Middle should be masked
        expect(result.slice(4, -4)).not.toContain("_");
    });

    it("returns original text if too short", () => {
        expect(mask("short")).toBe("short");
    });

    it("returns original text if exactly at threshold", () => {
        expect(mask("12345678")).toBe("12345678"); // 4 + 4 = 8 chars
    });

    it("masks with custom unmasked start chars", () => {
        const result = mask("rr_api_key_1234567890", 6, 4);
        expect(result.length).toBe("rr_api_key_1234567890".length);
        expect(result.startsWith("rr_api")).toBe(true);
        expect(result.endsWith("7890")).toBe(true);
        // Middle should be masked
        expect(result.slice(6, -4)).not.toContain("_");
    });

    it("masks with custom unmasked end chars", () => {
        const result = mask("rr_api_key_1234567890", 4, 6);
        expect(result).toMatch(/^rr_a[*]+567890$/);
        expect(result.length).toBe("rr_api_key_1234567890".length);
        expect(result.startsWith("rr_a")).toBe(true);
        expect(result.endsWith("567890")).toBe(true);
    });

    it("masks with custom mask character", () => {
        const result = mask("rr_api_key_1234567890", 4, 4, {
            maskCharacter: "X",
        });
        expect(result).toMatch(/^rr_a[X]+7890$/);
        expect(result.length).toBe("rr_api_key_1234567890".length);
        expect(result.startsWith("rr_a")).toBe(true);
        expect(result.endsWith("7890")).toBe(true);
    });

    it("handles very long strings", () => {
        const longString = "a".repeat(100);
        const result = mask(longString);
        expect(result.length).toBe(100);
        expect(result.startsWith("aaaa")).toBe(true);
        expect(result.endsWith("aaaa")).toBe(true);
        expect(result.slice(4, -4)).not.toContain("a");
    });

    it("handles strings with special characters", () => {
        const special = "test_key_!@#$%^&*()";
        const result = mask(special);
        expect(result.startsWith("test")).toBe(true);
        expect(result.endsWith("()")).toBe(true);
    });
});
