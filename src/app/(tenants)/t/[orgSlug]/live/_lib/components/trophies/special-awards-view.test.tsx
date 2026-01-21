import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { SpecialAwardsView } from "./special-awards-view";
import * as useLiveDataModule from "../../hooks/useLiveData";
import type { SpecialAwards } from "./types";
import type { ResultsEntry } from "@/dto/live-results";

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
    summary: { totalClean: 4, totalCones: 15, totalDNF: 0 },
    indexedTotalTime: 45.123,
    rawTotalTime: 45.123,
    segments: [],
};

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(),
}));

describe("SpecialAwardsView", () => {
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
            findDriverInRawResults: vi.fn(() => mockEntry),
            createDriverId: vi.fn(
                (driver: { name: string; number: string; carClass: string }) =>
                    `${driver.name}|${driver.number}|${driver.carClass}`
            ),
        } as ReturnType<typeof useLiveDataModule.useLiveData>);
    });

    it("renders Shoutouts heading", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: null,
            consistencyKing: null,
            speedDemon: null,
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Shoutouts")).toBeVisible();
    });

    it("renders Speed Demon award when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: null,
            consistencyKing: null,
            speedDemon: {
                name: "John Doe",
                number: "42",
                car: "2020 Mazda Miata",
                class: "STR",
                fastestTime: 40.123,
            },
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Speed Demon")).toBeVisible();
        expect(screen.getByText("John Doe")).toBeVisible();
    });

    it("renders Cone Killer award when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: {
                name: "Jane Smith",
                number: "99",
                car: "2021 Honda Civic",
                class: "SS",
                totalCones: 15,
            },
            hailMary: null,
            consistencyKing: null,
            speedDemon: null,
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Cone Killer")).toBeVisible();
        expect(screen.getByText("Jane Smith")).toBeVisible();
    });

    it("renders Consistency King award when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: null,
            consistencyKing: {
                name: "Bob Johnson",
                number: "5",
                car: "2022 Porsche GT4",
                class: "SS",
                variance: 0.123,
                avgTime: 45.456,
            },
            speedDemon: null,
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Consistency King/Queen")).toBeVisible();
        expect(screen.getByText("Bob Johnson")).toBeVisible();
    });

    it("renders Hail Mary award when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: {
                name: "Alice Brown",
                number: "7",
                car: "2020 Subaru WRX",
                class: "STU",
                fastestRun: 42.0,
                outlierGap: 2.5,
            },
            consistencyKing: null,
            speedDemon: null,
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Hail Mary")).toBeVisible();
        expect(screen.getByText("Alice Brown")).toBeVisible();
    });

    it("renders Squeaky Clean award when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: null,
            consistencyKing: null,
            speedDemon: null,
            squeakyClean: [
                {
                    name: "Clean Driver",
                    number: "10",
                    car: "2020 Mazda Miata",
                    class: "STR",
                },
            ],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Squeaky Clean")).toBeVisible();
        expect(screen.getByText("Clean Driver")).toBeVisible();
    });

    it("does not render awards that are null", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: null,
            hailMary: null,
            consistencyKing: null,
            speedDemon: null,
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.queryByText("Speed Demon")).not.toBeInTheDocument();
        expect(screen.queryByText("Cone Killer")).not.toBeInTheDocument();
        expect(
            screen.queryByText("Consistency King/Queen")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Hail Mary")).not.toBeInTheDocument();
    });

    it("renders multiple awards when present", () => {
        const specialAwards: SpecialAwards = {
            coneKiller: {
                name: "Jane Smith",
                number: "99",
                car: "2021 Honda Civic",
                class: "SS",
                totalCones: 15,
            },
            hailMary: null,
            consistencyKing: null,
            speedDemon: {
                name: "John Doe",
                number: "42",
                car: "2020 Mazda Miata",
                class: "STR",
                fastestTime: 40.123,
            },
            squeakyClean: [],
        };

        renderWithProviders(
            <SpecialAwardsView specialAwards={specialAwards} />
        );

        expect(screen.getByText("Cone Killer")).toBeVisible();
        expect(screen.getByText("Speed Demon")).toBeVisible();
    });
});
