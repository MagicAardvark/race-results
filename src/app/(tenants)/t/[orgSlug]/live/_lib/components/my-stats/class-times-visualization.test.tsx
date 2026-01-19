import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { ClassTimesVisualization } from "./class-times-visualization";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import * as useLiveDataModule from "../../hooks/useLiveData";
import { DisplayMode } from "../../types";

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(() => ({
        classResults: mockClassResults,
        classResultsMap: new Map([["SS", mockClassResults.results[0]!]]),
        displayMode: "autocross",
        createDriverId: (driver: {
            name: string;
            number: string;
            carClass: string;
        }) => `${driver.name}|${driver.number}|${driver.carClass}`,
    })),
}));

describe("ClassTimesVisualization", () => {
    beforeEach(() => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: mockClassResults,
            classResultsMap: new Map([["SS", mockClassResults.results[0]!]]),
            paxResults: null,
            rawResults: null,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            classNames: ["SS", "DST", "CS"],
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: (driver: {
                name: string;
                number: string;
                carClass: string;
            }) => `${driver.name}|${driver.number}|${driver.carClass}`,
        } as ReturnType<typeof useLiveDataModule.useLiveData>);
    });

    it("renders no times message when no drivers available", () => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: null,
            classResultsMap: null,
            paxResults: null,
            rawResults: null,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            classNames: [],
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: () => "",
        } as ReturnType<typeof useLiveDataModule.useLiveData>);

        const classEntry = mockClassResults.results[0]!.entries[0]!;
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classEntry}
                selectedDriverId="test-id"
            />
        );

        expect(screen.getByText("No times available")).toBeVisible();
    });

    it("renders all drivers in class", () => {
        const classEntry = mockClassResults.results[0]!.entries[0]!;
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classEntry}
                selectedDriverId="test-id"
            />
        );

        // Should render driver names from SS class
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("highlights selected driver", () => {
        const classEntry = mockClassResults.results[0]!.entries[0]!;
        const driverId = "Sarah Johnson|35|SS";
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classEntry}
                selectedDriverId={driverId}
            />
        );

        // Selected driver should be visible
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders times for all drivers", () => {
        const classEntry = mockClassResults.results[0]!.entries[0]!;
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classEntry}
                selectedDriverId="test-id"
            />
        );

        // Should render time values
        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("handles empty class result when no class data available", () => {
        const firstEntry = mockClassResults.results[0]!.entries[0]!;
        const emptyClassEntry = {
            ...firstEntry,
            segments: [],
        };

        // Mock classResultsMap to return null/undefined for the class
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: mockClassResults,
            classResultsMap: new Map(), // Empty map - no class data
            paxResults: null,
            rawResults: null,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {},
            classNames: [],
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: (driver: {
                name: string;
                number: string;
                carClass: string;
            }) => `${driver.name}|${driver.number}|${driver.carClass}`,
        } as ReturnType<typeof useLiveDataModule.useLiveData>);

        renderWithProviders(
            <ClassTimesVisualization
                classResult={emptyClassEntry}
                selectedDriverId="test-id"
            />
        );

        expect(screen.getByText("No times available")).toBeVisible();
    });

    it("renders gap visualization", () => {
        const classEntry = mockClassResults.results[0]!.entries[0]!;
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classEntry}
                selectedDriverId="test-id"
            />
        );

        // Gap visualization should be present
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });
});
