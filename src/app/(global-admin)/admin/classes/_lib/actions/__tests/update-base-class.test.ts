import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/require-role", () => ({
    requireRole: vi.fn(),
}));

vi.mock("@/services/classes-admin/classes-admin.service", () => ({
    classesAdminService: {
        updateGlobalBaseClass: vi.fn(),
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
import { mockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";
import { updateBaseClass } from "@/app/(global-admin)/admin/classes/_lib/actions/update-base-class";

const mockClass = {
    classId: "class123",
};

describe("updateBaseClass", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: auth succeeds unless test overrides
        vi.mocked(requireRole).mockResolvedValue(mockUserWithExtendedDetails);
    });

    it("requires admin role", async () => {
        vi.mocked(requireRole).mockRejectedValue(new Error("NEXT_REDIRECT"));

        await expect(
            updateBaseClass(mockClass.classId, {
                shortName: "SS",
                longName: "Super Street",
                isEnabled: true,
            })
        ).rejects.toThrow("NEXT_REDIRECT");
    });

    it("validates required fields", async () => {
        const result = await updateBaseClass(mockClass.classId, {
            shortName: "",
            longName: "",
            isEnabled: true,
        });

        expect(result.isError).toBe(true);

        if (result.isError) {
            expect(result.errors).toBeDefined();
        }
    });

    it("updates class successfully", async () => {
        const mockClass = {
            classId: "class123",
            shortName: "SS",
            longName: "Super Street",
            isEnabled: true,
        };

        vi.mocked(classesAdminService.updateGlobalBaseClass).mockResolvedValue(
            mockClass
        );

        const result = await updateBaseClass(mockClass.classId, {
            shortName: "SS",
            longName: "Super Street",
            isEnabled: true,
        });

        expect(result.isError).toBe(false);
        expect(result.data).not.toBeNull();
    });
});
