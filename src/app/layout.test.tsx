import { describe, it, expect, vi } from "vitest";
import { mockUser } from "@/__tests__/mocks/mock-users";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

// Mock dependencies
vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
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
    it("calls getCurrentUserCached", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(null);

        // Import the layout component
        const RootLayout = (await import("./layout")).default;

        // The layout is a server component, so we can't render it directly
        // But we can verify the service is called
        await RootLayout({ children: <div>Test</div> });

        expect(getCurrentUserCached).toHaveBeenCalled();
    });

    it("handles user service returning null", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(null);
        const RootLayout = (await import("./layout")).default;

        await RootLayout({ children: <div>Test</div> });

        expect(getCurrentUserCached).toHaveBeenCalled();
    });

    it("handles user service returning a user", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockUser);
        const RootLayout = (await import("./layout")).default;

        await RootLayout({ children: <div>Test</div> });

        expect(getCurrentUserCached).toHaveBeenCalled();
    });
});
