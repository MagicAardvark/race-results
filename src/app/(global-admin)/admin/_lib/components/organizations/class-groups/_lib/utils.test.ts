import { describe, it, expect } from "vitest";
import { toTitleCase, toUpperCase } from "./utils";

describe("toTitleCase", () => {
    it("converts lowercase string to title case", () => {
        expect(toTitleCase("super street modified")).toBe(
            "Super Street Modified"
        );
    });

    it("converts uppercase string to title case", () => {
        expect(toTitleCase("SUPER STREET MODIFIED")).toBe(
            "Super Street Modified"
        );
    });

    it("converts mixed case string to title case", () => {
        expect(toTitleCase("sUpEr StReEt MoDiFiEd")).toBe(
            "Super Street Modified"
        );
    });

    it("handles single word", () => {
        expect(toTitleCase("street")).toBe("Street");
    });

    it("handles empty string", () => {
        expect(toTitleCase("")).toBe("");
    });

    it("trims whitespace", () => {
        expect(toTitleCase("  super street  ")).toBe("Super Street");
    });

    it("handles multiple spaces", () => {
        // toTitleCase collapses multiple spaces into single spaces
        expect(toTitleCase("super   street")).toBe("Super Street");
    });

    it("handles string with numbers", () => {
        expect(toTitleCase("class 1 street")).toBe("Class 1 Street");
    });
});

describe("toUpperCase", () => {
    it("converts lowercase string to uppercase", () => {
        expect(toUpperCase("ssm")).toBe("SSM");
    });

    it("converts mixed case string to uppercase", () => {
        expect(toUpperCase("SsM")).toBe("SSM");
    });

    it("handles already uppercase string", () => {
        expect(toUpperCase("SSM")).toBe("SSM");
    });

    it("handles string with spaces", () => {
        expect(toUpperCase("super street")).toBe("SUPER STREET");
    });

    it("handles empty string", () => {
        expect(toUpperCase("")).toBe("");
    });

    it("trims whitespace", () => {
        expect(toUpperCase("  ssm  ")).toBe("SSM");
    });

    it("handles string with numbers", () => {
        expect(toUpperCase("class1")).toBe("CLASS1");
    });
});
