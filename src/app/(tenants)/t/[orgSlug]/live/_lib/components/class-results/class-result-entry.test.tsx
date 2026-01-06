import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassResultEntry } from "./class-result-entry";
import type { ClassResult } from "../../types";
import { DisplayMode } from "../../types";

const mockEntry: ClassResult = {
    car: "2022 Porsche GT4",
    carClassGroup: "SS",
    carClass: "SS",
    color: "Frozen Berry",
    name: "Sarah Johnson",
    number: "35",
    position: "1T",
    paxPosition: 6,
    runInfo: {
        cleanCount: 4,
        coneCount: 9,
        dnfCount: 1,
        toFirstInClass: 0,
        toNextInClass: 0,
        toFirstInPax: 0.961,
        toNextInPax: 0.195,
        runs: [
            {
                number: 1,
                status: "CLEAN",
                time: 58.524,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 2,
                status: "CLEAN",
                time: 57.646,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 3,
                status: "CLEAN",
                time: 57.414,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 4,
                status: "CLEAN",
                time: 57.222,
                coneCount: 0,
                isBest: true,
            },
        ],
        total: 57.222,
        paxTime: 47.837,
        rallyCrossTime: 0,
        rallyCrossToFirst: 0,
        rallyCrossToNext: 0,
    },
};

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
        const paxLeader: ClassResult = {
            ...mockEntry,
            paxPosition: 1,
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
        const entryWithoutRuns: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                runs: [],
            },
        };

        renderWithProviders(
            <ClassResultEntry
                entry={entryWithoutRuns}
                allEntries={[entryWithoutRuns]}
            />
        );

        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("renders rallycross mode correctly", () => {
        const rallycrossEntry: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                rallyCrossTime: 60.5,
                rallyCrossToFirst: 0,
                rallyCrossToNext: 1.2,
            },
        };

        renderWithProviders(
            <ClassResultEntry
                entry={rallycrossEntry}
                allEntries={[rallycrossEntry]}
            />,
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
        const rallycrossEntry: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                rallyCrossTime: 60.5,
            },
        };

        renderWithProviders(
            <ClassResultEntry
                entry={rallycrossEntry}
                allEntries={[rallycrossEntry]}
            />,
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
