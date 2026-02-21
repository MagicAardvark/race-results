import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { mockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";
import Page from "./page";

vi.mock("server-only", () => ({}));

vi.mock("../_lib/components/my-stats/my-stats", () => ({
    MyStats: () => <div data-testid="my-stats">My Stats</div>,
}));

vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn(),
}));

vi.mock("@/services/users/user.service", () => ({
    userService: {
        getCurrentUser: vi.fn(),
    },
}));

import { auth } from "@clerk/nextjs/server";
import { userService } from "@/services/users/user.service";

describe("MePage", () => {
    it("renders MyStats when user is linked (has motorsportregId)", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue({
            ...mockUserWithExtendedDetails,
            motorsportregId: "msr-123",
        });

        const content = await Page();
        renderWithProviders(content);

        expect(screen.getByTestId("my-stats")).toBeVisible();
    });
});
