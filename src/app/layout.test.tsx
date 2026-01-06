import { describe, it, expect, vi } from "vitest";
import { userService } from "@/services/users/user.service";
import { mockUser } from "@/__tests__/mocks/mock-users";

// Mock dependencies
vi.mock("@/services/users/user.service", () => ({
    userService: {
        getCurrentUser: vi.fn(),
    },
}));

vi.mock("@clerk/nextjs", () => ({
    ClerkProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="clerk-provider">{children}</div>
    ),
}));

vi.mock("sonner", () => ({
    Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("next/font/google", () => ({
    Geist: vi.fn(() => ({ variable: "--font-geist-sans" })),
    Geist_Mono: vi.fn(() => ({ variable: "--font-geist-mono" })),
    Noto_Sans: vi.fn(() => ({ variable: "--font-sans" })),
}));

describe("RootLayout", () => {
    it("calls userService.getCurrentUser", async () => {
        vi.mocked(userService.getCurrentUser).mockResolvedValue(null);

        // Import the layout component
        const RootLayout = (await import("./layout")).default;

        // The layout is a server component, so we can't render it directly
        // But we can verify the service is called
        await RootLayout({ children: <div>Test</div> });

        expect(userService.getCurrentUser).toHaveBeenCalled();
    });

    it("handles user service returning null", async () => {
        vi.mocked(userService.getCurrentUser).mockResolvedValue(null);

        const RootLayout = (await import("./layout")).default;

        await RootLayout({ children: <div>Test</div> });

        expect(userService.getCurrentUser).toHaveBeenCalled();
    });

    it("handles user service returning a user", async () => {
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockUser);

        const RootLayout = (await import("./layout")).default;

        await RootLayout({ children: <div>Test</div> });

        expect(userService.getCurrentUser).toHaveBeenCalled();
    });
});
