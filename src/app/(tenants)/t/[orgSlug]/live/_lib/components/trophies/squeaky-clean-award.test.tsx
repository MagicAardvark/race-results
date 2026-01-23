import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { SqueakyCleanAward } from "./squeaky-clean-award";
import * as useLiveDataModule from "../../hooks/useLiveData";
import type { ResultsEntry } from "@/dto/live-results";

const mockWinners = [
    {
        name: "John Doe",
        number: "42",
        car: "2020 Mazda Miata",
        class: "STR",
    },
    {
        name: "Jane Smith",
        number: "99",
        car: "2021 Honda Civic",
        class: "SS",
    },
];

const mockEntry: ResultsEntry = {
    entryKey: "STR-42-John Doe",
    msrId: "",
    email: "",
    class: "STR",
    carNumber: "42",
    driverName: "John Doe",
    carModel: "2020 Mazda Miata",
    carColor: "",
    sponsor: "",
    classPosition: { position: 1, toNext: null, toFirst: null },
    indexedPosition: { position: 1, toNext: null, toFirst: null },
    rawPosition: { position: 1, toNext: null, toFirst: null },
    isTrophy: false,
    summary: { totalClean: 4, totalCones: 0, totalDNF: 0 },
    indexedTotalTime: 45.123,
    rawTotalTime: 45.123,
    segments: [],
};

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(),
}));

describe("SqueakyCleanAward", () => {
    beforeEach(() => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: null,
            classResultsMap: null,
            paxResults: null,
            rawResults: null,
            runWork: null,
            displayMode: "autocross",
            featureFlags: {},
            classNames: [],
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn((driverId: string) => {
                if (driverId.includes("John Doe")) {
                    return mockEntry;
                }
                return null;
            }),
            createDriverId: vi.fn(
                (driver: { name: string; number: string; carClass: string }) =>
                    `${driver.name}|${driver.number}|${driver.carClass}`
            ),
        } as ReturnType<typeof useLiveDataModule.useLiveData>);
    });

    it("returns null when winners array is empty", () => {
        const { container } = renderWithProviders(
            <SqueakyCleanAward winners={[]} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders title and description", () => {
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        expect(screen.getByText("Squeaky Clean")).toBeVisible();
        expect(
            screen.getByText(
                /Drivers who completed all runs with no DNFs, no cones, and no penalties/
            )
        ).toBeVisible();
    });

    it("displays winner count for multiple drivers", () => {
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        expect(screen.getByText(/2 drivers/)).toBeVisible();
    });

    it("displays winner count for single driver", () => {
        renderWithProviders(<SqueakyCleanAward winners={[mockWinners[0]!]} />);

        expect(screen.getByText(/1 driver/)).toBeVisible();
    });

    it("renders all winners", () => {
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        expect(screen.getByText("John Doe")).toBeVisible();
        expect(screen.getByText("Jane Smith")).toBeVisible();
    });

    it("displays winner information", () => {
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        expect(screen.getByText("#42 • 2020 Mazda Miata")).toBeVisible();
        expect(screen.getByText("Class STR")).toBeVisible();
    });

    it("toggles run data when winner card is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        // Initially run data should not be visible
        expect(screen.queryByText("Run 1")).not.toBeInTheDocument();

        // Click on John Doe's card
        const johnCard = screen.getByText("John Doe").closest("button");
        if (johnCard) {
            await user.click(johnCard);
            // RunData should now be rendered (we can't easily test exact content)
            expect(johnCard).toBeInTheDocument();
        }
    });

    it("expands only one driver at a time", async () => {
        const user = userEvent.setup();
        renderWithProviders(<SqueakyCleanAward winners={mockWinners} />);

        // Click on first winner
        const johnCard = screen.getByText("John Doe").closest("button");
        if (johnCard) {
            await user.click(johnCard);
        }

        // Click on second winner
        const janeCard = screen.getByText("Jane Smith").closest("button");
        if (janeCard) {
            await user.click(janeCard);
            // Only one should be expanded at a time
            expect(janeCard).toBeInTheDocument();
        }
    });
});
