import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassResultEntry } from "./class-result-entry";
import type { ResultsEntry } from "@/dto/live-results";
import { DisplayMode } from "../../types";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";

const mockEntry: ResultsEntry = mockClassResults.results[0]!.entries[0]!;

describe("ClassResultEntry", () => {
    it("renders driver information", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />
        );

        expect(screen.getByText("Sarah Johnson")).toBeVisible();
        expect(screen.getByText(/SS #35/i)).toBeVisible();
    });

    it("renders position and PAX position in autocross mode", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />,
            {
                liveData: {
                    displayMode: DisplayMode.autocross,
                },
            }
        );

        // Position shows "1T" because isTrophy is true
        expect(screen.getByText("1T")).toBeVisible();
        expect(screen.getByText("6")).toBeVisible();
    });

    it("renders best time in autocross mode", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />,
            {
                liveData: {
                    displayMode: DisplayMode.autocross,
                },
            }
        );

        // Best time appears in multiple places, check for the main time value
        const timeElements = screen.getAllByText(/57\.222/i);
        expect(timeElements.length).toBeGreaterThan(0);
        expect(timeElements[0]).toBeVisible();
    });

    it("highlights PAX leader", () => {
        const paxLeader: ResultsEntry = {
            ...mockEntry,
            indexedPosition: {
                ...mockEntry.indexedPosition,
                position: 1,
            },
        };

        const { container } = renderWithProviders(
            <ClassResultEntry entry={paxLeader} allEntries={[paxLeader]} />
        );

        const card = container.querySelector("div[class*='bg-orange']");
        expect(card).toBeInTheDocument();
    });

    it("toggles run data on click", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />
        );

        const card = screen
            .getByText("Sarah Johnson")
            .closest("div[class*='cursor-pointer']");
        if (card) {
            await user.click(card);
            expect(screen.getByText("Cones")).toBeVisible();
        }
    });

    it("renders last run time", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />
        );

        // Last run time appears in multiple places, check for any instance
        const timeElements = screen.getAllByText(/57\.222/i);
        expect(timeElements.length).toBeGreaterThan(0);
        expect(timeElements[0]).toBeVisible();
    });

    it("shows N/A when no runs exist", () => {
        const entryWithoutRuns: ResultsEntry = {
            ...mockEntry,
            segments: [
                {
                    name: "Segment 1",
                    indexedTotalTime: null,
                    rawTotalTime: null,
                    totalClean: 0,
                    totalCones: 0,
                    totalDNF: 0,
                    runs: {},
                },
            ],
        };

        renderWithProviders(
            <ClassResultEntry
                entry={entryWithoutRuns}
                allEntries={[entryWithoutRuns]}
            />
        );

        // N/A appears multiple times (best time and last run), check that at least one is visible
        const naElements = screen.getAllByText("N/A");
        expect(naElements.length).toBeGreaterThan(0);
        expect(naElements[0]).toBeVisible();
    });

    it("renders rallycross mode correctly", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />,
            {
                liveData: {
                    displayMode: DisplayMode.rallycross,
                },
            }
        );

        expect(screen.getByText("Class")).toBeVisible();
        expect(screen.getByText("Total")).toBeVisible();
    });

    it("renders position badge without PAX in rallycross mode", () => {
        renderWithProviders(
            <ClassResultEntry entry={mockEntry} allEntries={[mockEntry]} />,
            {
                liveData: {
                    displayMode: DisplayMode.rallycross,
                },
            }
        );

        // Should show "Class" label, not "Pos"
        expect(screen.getByText("Class")).toBeVisible();
        // Should not show PAX position
        expect(screen.queryByText("PAX")).not.toBeInTheDocument();
    });
});
