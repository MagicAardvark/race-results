import { describe, it, expect } from "vitest";
import { createClassGroupSchema, updateClassGroupSchema } from "./class-groups";

describe("createClassGroupSchema", () => {
    it("validates valid input", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classIds: ["class-1", "class-2"],
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
            expect(result.data.longName).toBe("Super Street Modified");
            expect(result.data.classIds).toEqual(["class-1", "class-2"]);
        }
    });

    it("transforms shortName to uppercase", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "ssm",
            longName: "Super Street Modified",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
        }
    });

    it("transforms longName to title case", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "super street modified",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.longName).toBe("Super Street Modified");
        }
    });

    it("handles mixed case input", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SsM",
            longName: "SuPeR sTrEeT mOdIfIeD",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
            expect(result.data.longName).toBe("Super Street Modified");
        }
    });

    it("defaults classIds to empty array when not provided", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.classIds).toEqual([]);
        }
    });

    it("accepts empty classIds array", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classIds: [],
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.classIds).toEqual([]);
        }
    });

    it("rejects empty shortName", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "",
            longName: "Super Street Modified",
        });

        expect(result.success).toBe(false);
    });

    it("rejects empty longName", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "",
        });

        expect(result.success).toBe(false);
    });

    it("rejects missing shortName", () => {
        const result = createClassGroupSchema.safeParse({
            longName: "Super Street Modified",
        });

        expect(result.success).toBe(false);
    });

    it("rejects missing longName", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "SSM",
        });

        expect(result.success).toBe(false);
    });

    it("trims whitespace before transforming", () => {
        const result = createClassGroupSchema.safeParse({
            shortName: "  ssm  ",
            longName: "  super street modified  ",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
            expect(result.data.longName).toBe("Super Street Modified");
        }
    });
});

describe("updateClassGroupSchema", () => {
    it("validates valid input", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
            isEnabled: true,
            classIds: ["class-1"],
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
            expect(result.data.longName).toBe("Super Street Modified");
            expect(result.data.classGroupId).toBe(
                "550e8400-e29b-41d4-a716-446655440000"
            );
            expect(result.data.isEnabled).toBe(true);
            expect(result.data.classIds).toEqual(["class-1"]);
        }
    });

    it("transforms shortName to uppercase", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "ssm",
            longName: "Super Street Modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
            isEnabled: true,
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.shortName).toBe("SSM");
        }
    });

    it("transforms longName to title case", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "super street modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
            isEnabled: true,
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.longName).toBe("Super Street Modified");
        }
    });

    it("defaults classIds to empty array when not provided", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
            isEnabled: true,
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.classIds).toEqual([]);
        }
    });

    it("rejects invalid UUID for classGroupId", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classGroupId: "not-a-uuid",
            isEnabled: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects missing classGroupId", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            isEnabled: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects missing isEnabled", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
        });

        expect(result.success).toBe(false);
    });

    it("accepts isEnabled as false", () => {
        const result = updateClassGroupSchema.safeParse({
            shortName: "SSM",
            longName: "Super Street Modified",
            classGroupId: "550e8400-e29b-41d4-a716-446655440000",
            isEnabled: false,
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.isEnabled).toBe(false);
        }
    });
});
