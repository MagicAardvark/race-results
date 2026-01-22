import { createMockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";
import { requireRole } from "@/lib/auth/require-role";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("NEXT_REDIRECT");
    }),
}));

describe("requireRole", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("expects redirect to be called if user does not exist", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(null);

        await expect(requireRole("admin")).rejects.toThrow("NEXT_REDIRECT");

        expect(redirect).toHaveBeenCalled();
    });

    it("expects redirect to be called if user lacks role", async () => {
        const userWithoutRole = createMockUserWithExtendedDetails({
            roles: [],
        });

        vi.mocked(getCurrentUserCached).mockResolvedValue(userWithoutRole);

        await expect(requireRole("admin")).rejects.toThrow("NEXT_REDIRECT");

        expect(redirect).toHaveBeenCalled();
    });

    it("returns user if they have the required role", async () => {
        const userWithRole = createMockUserWithExtendedDetails({
            roles: ["admin"],
        });

        vi.mocked(getCurrentUserCached).mockResolvedValue(userWithRole);

        const user = await requireRole("admin");

        expect(redirect).not.toHaveBeenCalled();
        expect(user).toBe(userWithRole);
    });

    it("returns user if have multiple roles", async () => {
        const userWithRoles = createMockUserWithExtendedDetails({
            roles: ["admin", "user"],
        });

        vi.mocked(getCurrentUserCached).mockResolvedValue(userWithRoles);

        const user = await requireRole("admin");

        expect(redirect).not.toHaveBeenCalled();
        expect(user).toBe(userWithRoles);
    });
});
