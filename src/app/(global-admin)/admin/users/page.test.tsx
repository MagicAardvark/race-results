import { describe, it, expect, vi } from "vitest";
import { userService } from "@/services/users/user.service";
import { createMockUser } from "@/__tests__/mocks/mock-users";

// Mock dependencies
vi.mock("@/services/users/user.service", () => ({
    userService: {
        getAllUsers: vi.fn(),
    },
}));

describe("UsersPage", () => {
    it("calls userService.getAllUsers", async () => {
        vi.mocked(userService.getAllUsers).mockResolvedValue([]);

        const Page = (await import("./page")).default;

        await Page();

        expect(userService.getAllUsers).toHaveBeenCalled();
    });

    it("handles empty users list", async () => {
        vi.mocked(userService.getAllUsers).mockResolvedValue([]);

        const Page = (await import("./page")).default;

        await Page();

        expect(userService.getAllUsers).toHaveBeenCalled();
    });

    it("handles users list", async () => {
        const mockUsers = [
            createMockUser({
                userId: "user-1",
                authProviderId: "clerk-1",
                displayName: "User 1",
            }),
        ];

        vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

        const Page = (await import("./page")).default;

        await Page();

        expect(userService.getAllUsers).toHaveBeenCalled();
    });
});
