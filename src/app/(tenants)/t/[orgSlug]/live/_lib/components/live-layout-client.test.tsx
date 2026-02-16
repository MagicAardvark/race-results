import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { LiveLayoutClient } from "./live-layout-client";
import { getNavigationPages } from "../utils/navigation";

const mockRefresh = vi.fn();
const mockPathname = "/t/test-org/live";

// Nav from server (no feature flags = all pages)
const defaultNavigationPages = getNavigationPages();

vi.mock("next/navigation", () => ({
    usePathname: () => mockPathname,
    useParams: () => ({ orgSlug: "test-org" }),
    useRouter: () => ({
        refresh: mockRefresh,
    }),
}));

describe("LiveLayoutClient", () => {
    beforeEach(() => {
        mockRefresh.mockClear();
    });

    it("renders navigation links", () => {
        renderWithProviders(
            <LiveLayoutClient
                basePath="/t/test-org/live"
                navigationPages={defaultNavigationPages}
            >
                <div>Test Content</div>
            </LiveLayoutClient>
        );

        expect(screen.getByRole("link", { name: /class/i })).toBeVisible();
        expect(screen.getByRole("link", { name: /raw/i })).toBeVisible();
    });

    it("renders refresh button", () => {
        renderWithProviders(
            <LiveLayoutClient
                basePath="/t/test-org/live"
                navigationPages={defaultNavigationPages}
            >
                <div>Test Content</div>
            </LiveLayoutClient>
        );

        const refreshButton = screen.getByRole("button", { name: /refresh/i });
        expect(refreshButton).toBeVisible();
    });

    it("calls router.refresh when refresh button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <LiveLayoutClient
                basePath="/t/test-org/live"
                navigationPages={defaultNavigationPages}
            >
                <div>Test Content</div>
            </LiveLayoutClient>
        );

        const refreshButton = screen.getByRole("button", { name: /refresh/i });
        await user.click(refreshButton);

        expect(mockRefresh).toHaveBeenCalled();
    });

    it("renders children", () => {
        renderWithProviders(
            <LiveLayoutClient
                basePath="/t/test-org/live"
                navigationPages={defaultNavigationPages}
            >
                <div data-testid="test-content">Test Content</div>
            </LiveLayoutClient>
        );

        expect(screen.getByTestId("test-content")).toBeVisible();
    });
});
