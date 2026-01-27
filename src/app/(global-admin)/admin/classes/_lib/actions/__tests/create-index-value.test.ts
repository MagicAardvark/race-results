import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/require-role", () => ({
    requireRole: vi.fn(),
}));

vi.mock("@/services/classes-admin/classes-admin.service", () => ({
    classesAdminService: {
        createIndexValue: vi.fn(),
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
import { createIndexValue } from "@/app/(global-admin)/admin/classes/_lib/actions/create-index-value";

describe("createIndexValue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: auth succeeds unless test overrides
        vi.mocked(requireRole).mockResolvedValue(mockUserWithExtendedDetails);
    });

    it("requires admin role", async () => {
        vi.mocked(requireRole).mockRejectedValue(new Error("NEXT_REDIRECT"));

        await expect(
            createIndexValue("123", {
                indexValue: 0.9,
                year: 2024,
            })
        ).rejects.toThrow("NEXT_REDIRECT");
    });

    it("validates index value", async () => {
        const result = await createIndexValue("123", {
            indexValue: -5,
            year: 2024,
        });

        expect(result.isError).toBe(true);

        if (result.isError) {
            expect(result.errors).toBeDefined();
        }
    });

    it("updates index value successfully", async () => {
        vi.mocked(classesAdminService.createIndexValue).mockResolvedValue();

        const result = await createIndexValue("123", {
            indexValue: 0.9,
            year: 2024,
        });

        expect(result.isError).toBe(false);
    });
});
