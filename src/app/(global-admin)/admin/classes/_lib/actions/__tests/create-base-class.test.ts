import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/require-role", () => ({
    requireRole: vi.fn(),
}));

vi.mock("@/services/classes-admin/classes-admin.service", () => ({
    classesAdminService: {
        createGlobalBaseClass: vi.fn(),
    },
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("NEXT_REDIRECT");
    }),
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

import { requireRole } from "@/lib/auth/require-role";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { createBaseClass } from "@/app/(global-admin)/admin/classes/_lib/actions/create-base-class";
import { mockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";
import { BaseCarClass } from "@/dto/classes-admin";

describe("createBaseClass", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: auth succeeds unless test overrides
        vi.mocked(requireRole).mockResolvedValue(mockUserWithExtendedDetails);
    });

    it("requires admin role", async () => {
        vi.mocked(requireRole).mockRejectedValue(new Error("NEXT_REDIRECT"));

        await expect(
            createBaseClass({
                shortName: "SS",
                longName: "Super Street",
                isIndexed: true,
            })
        ).rejects.toThrow("NEXT_REDIRECT");
    });

    it("validates required fields", async () => {
        const result = await createBaseClass({
            shortName: "",
            longName: "",
            isIndexed: true,
        });

        expect(result.isError).toBe(true);

        if (result.isError) {
            expect(result.errors).toBeDefined();
        }
    });

    it("creates class successfully", async () => {
        const mockClass = {
            classId: "class123",
            shortName: "SS",
            longName: "Super Street",
            classType: {
                classTypeId: "type1",
                classTypeKey: "None",
                shortName: "None",
                longName: "",
                isEnabled: true,
            },
            classCategory: {
                classCategoryId: "cat1",
                shortName: "None",
                longName: "",
                isEnabled: true,
            },
            classTypeKey: "None",
            classCategoryId: "cat1",
            indexValues: [
                {
                    indexValueId: "index1",
                    value: 0.8,
                    year: new Date().getFullYear(),
                },
            ],
            isEnabled: true,
            isIndexed: true,
        } as BaseCarClass;

        vi.mocked(classesAdminService.createGlobalBaseClass).mockResolvedValue(
            mockClass
        );

        const result = await createBaseClass({
            shortName: "SS",
            longName: "Super Street",
            isIndexed: true,
            indexValue: 0.8,
            classTypeKey: "None",
            classCategoryId: "cat1",
        });

        expect(result.isError).toBe(false);
        expect(result.data).not.toBeNull();
    });
});
