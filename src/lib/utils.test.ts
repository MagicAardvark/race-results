import { describe, it, expect } from "vitest";
import { cn, nameof } from "./utils";

describe("cn", () => {
    it("merges class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
        expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("merges conflicting Tailwind classes", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
    });

    it("handles empty input", () => {
        expect(cn()).toBe("");
    });

    it("handles undefined and null", () => {
        expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("handles arrays", () => {
        expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("handles objects", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });
});

describe("nameof", () => {
    type TestType = {
        name: string;
        age: number;
        email: string;
    };

    it("returns property name as string", () => {
        expect(nameof<TestType>("name")).toBe("name");
        expect(nameof<TestType>("age")).toBe("age");
        expect(nameof<TestType>("email")).toBe("email");
    });

    it("returns string type", () => {
        const result = nameof<TestType>("name");
        expect(typeof result).toBe("string");
    });
});
