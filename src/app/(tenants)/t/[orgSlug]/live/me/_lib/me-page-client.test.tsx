import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { MePageClient } from "./me-page-client";
import { createMockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";

vi.mock("../../_lib/hooks/useLiveData", () => ({
    useLiveData: () => ({
        getAllDrivers: () => [
            {
                id: "driver-1",
                name: "Test Driver",
                number: "1",
                carClass: "SS",
                car: "Car",
                color: "Red",
                msrId: "msr-1",
                email: "test@example.com",
            },
        ],
    }),
}));

vi.mock("@/app/actions/user-profile", () => ({
    linkDriverToCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@clerk/nextjs", () => ({
    SignInButton: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="sign-in-button">{children}</div>
    ),
}));

vi.mock("../../_lib/components/my-stats/my-stats", () => ({
    MyStats: () => <div data-testid="my-stats">My Stats</div>,
}));

describe("MePageClient", () => {
    it("renders sign-in CTA when user is null", () => {
        renderWithProviders(<MePageClient user={null} />);

        expect(screen.getByTestId("sign-in-button")).toBeVisible();
        expect(
            screen.getByText(/Sign in to view your personal stats/)
        ).toBeVisible();
    });

    it("renders driver link warning and form when user is signed in but not linked", () => {
        const user = createMockUserWithExtendedDetails({
            motorsportregId: null,
            driverLinkedAt: null,
        });

        renderWithProviders(<MePageClient user={user} />);

        expect(
            screen.getByText(
                /You must select your own name from the list below/
            )
        ).toBeVisible();
        expect(screen.getByText("I am this driver")).toBeVisible();
        expect(
            screen.getByRole("button", { name: "This is me" })
        ).toBeVisible();
    });

    it("renders MyStats when user is linked (has motorsportregId)", () => {
        const user = createMockUserWithExtendedDetails({
            motorsportregId: "msr-123",
        });

        renderWithProviders(<MePageClient user={user} />);

        expect(screen.getByTestId("my-stats")).toBeVisible();
    });

    it("renders MyStats when user has driverLinkedAt but no motorsportregId", () => {
        const user = createMockUserWithExtendedDetails({
            motorsportregId: null,
            driverLinkedAt: new Date(),
        });

        renderWithProviders(<MePageClient user={user} />);

        expect(screen.getByTestId("my-stats")).toBeVisible();
        expect(
            screen.getByText(/Unable to sync your account with MotorsportReg/)
        ).toBeVisible();
    });
});
