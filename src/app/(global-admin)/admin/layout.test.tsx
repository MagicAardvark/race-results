import { describe, it, expect, vi } from "vitest";
import { userService } from "@/services/users/user.service";
import { redirect } from "next/navigation";
import { createMockUser } from "@/__tests__/mocks/mock-users";

// Mock dependencies
vi.mock("@/services/users/user.service", () => ({
    userService: {
        getCurrentUser: vi.fn(),
    },
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

vi.mock("@/app/components/shared/layout/configuration-layout", () => ({
    ConfigurationLayout: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="configuration-layout">{children}</div>
    ),
}));

vi.mock("@/lib/shared/layout/configuration/navigation", () => ({
    filterNavForRoles: vi.fn((nav) => nav),
}));

describe("AdminLayout", () => {
    it("redirects when user is not admin", async () => {
        const testUser = createMockUser({ roles: ["user"] });

        vi.mocked(userService.getCurrentUser).mockResolvedValue(testUser);

        const AdminLayout = (await import("./layout")).default;

        await AdminLayout({ children: <div>Test</div> });

        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("renders layout when user is admin", async () => {
        const testUser = createMockUser({ roles: ["admin"] });

        vi.mocked(userService.getCurrentUser).mockResolvedValue(testUser);
        vi.mocked(redirect).mockImplementation(() => {
            throw new Error("Redirect should not be called");
        });

        const AdminLayout = (await import("./layout")).default;

        // Should not throw
        await expect(
            AdminLayout({ children: <div>Test</div> })
        ).resolves.toBeDefined();
    });

    it("handles null user", async () => {
        vi.mocked(userService.getCurrentUser).mockResolvedValue(null);
        vi.mocked(redirect).mockImplementation(() => {
            // Redirect throws in Next.js, so we expect it to be called
            throw new Error("NEXT_REDIRECT");
        });

        const AdminLayout = (await import("./layout")).default;

        await expect(
            AdminLayout({ children: <div>Test</div> })
        ).rejects.toThrow("NEXT_REDIRECT");

        expect(redirect).toHaveBeenCalledWith("/");
    });
});
