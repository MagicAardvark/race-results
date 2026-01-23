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

describe("createBaseClass", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: auth succeeds unless test overrides
        vi.mocked(requireRole).mockResolvedValue(mockUserWithExtendedDetails);
    });

    it("requires admin role", async () => {
        vi.mocked(requireRole).mockRejectedValue(new Error("NEXT_REDIRECT"));

        await expect(
            createBaseClass({ shortName: "SS", longName: "Super Street" })
        ).rejects.toThrow("NEXT_REDIRECT");
    });

    it("validates required fields", async () => {
        const result = await createBaseClass({ shortName: "", longName: "" });

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
            isEnabled: true,
        };

        vi.mocked(classesAdminService.createGlobalBaseClass).mockResolvedValue(
            mockClass
        );

        const result = await createBaseClass({
            shortName: "SS",
            longName: "Super Street",
        });

        expect(result.isError).toBe(false);
        expect(result.data).toBe(mockClass);
    });
});
