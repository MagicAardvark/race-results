import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { Trophies } from "./trophies";
import * as useLiveDataModule from "../../hooks/useLiveData";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import { DisplayMode } from "../../types";

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(),
}));

describe("Trophies", () => {
    beforeEach(() => {
        const classResultsMap = new Map([["SS", mockClassResults.results[0]!]]);

        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResultsMap,
            classNames: ["SS"],
            paxResults: null,
            rawResults: mockRawResults,
            classResults: mockClassResults,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: vi.fn(),
        } as ReturnType<typeof useLiveDataModule.useLiveData>);
    });

    it("renders view toggle", () => {
        renderWithProviders(<Trophies />);

        expect(screen.getByText("Class Trophies")).toBeVisible();
        expect(screen.getByText("Shoutouts")).toBeVisible();
    });

    it("renders class trophies view by default", () => {
        renderWithProviders(<Trophies />);

        // Should show class trophy accordion
        expect(screen.getByText(/Super Street/i)).toBeVisible();
    });

    it("switches to shoutouts view when toggle is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(<Trophies />);

        // Get the button, not the heading
        const shoutoutsButtons = screen.getAllByText("Shoutouts");
        const shoutoutsButton = shoutoutsButtons.find(
            (btn) => btn.tagName === "BUTTON"
        );
        expect(shoutoutsButton).toBeDefined();
        if (shoutoutsButton) {
            await user.click(shoutoutsButton);
        }

        // Should show special awards view (heading)
        expect(
            screen.getByRole("heading", { name: "Shoutouts" })
        ).toBeVisible();
        // Should hide class trophies
        expect(screen.queryByText(/Super Street/i)).not.toBeInTheDocument();
    });

    it("switches back to trophies view when toggle is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(<Trophies />);

        // Switch to shoutouts
        const shoutoutsButton = screen.getByText("Shoutouts");
        await user.click(shoutoutsButton);

        // Switch back to trophies
        const trophiesButton = screen.getByText("Class Trophies");
        await user.click(trophiesButton);

        expect(screen.getByText(/Super Street/i)).toBeVisible();
    });

    it("renders empty state when no trophy data and no special awards", () => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResultsMap: null,
            classNames: [],
            paxResults: null,
            rawResults: null,
            classResults: null,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: vi.fn(),
        } as ReturnType<typeof useLiveDataModule.useLiveData>);

        renderWithProviders(<Trophies />);

        expect(screen.getByText("No trophy winners found")).toBeVisible();
    });

    it("renders trophies even when special awards are null", () => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResultsMap: new Map([["SS", mockClassResults.results[0]!]]),
            classNames: ["SS"],
            paxResults: null,
            rawResults: null,
            classResults: mockClassResults,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: vi.fn(),
        } as ReturnType<typeof useLiveDataModule.useLiveData>);

        renderWithProviders(<Trophies />);

        expect(screen.getByText(/Super Street/i)).toBeVisible();
    });
});
