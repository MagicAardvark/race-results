import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { ClassTimesVisualization } from "./class-times-visualization";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import * as useLiveDataModule from "../../hooks/useLiveData";
import { DisplayMode } from "../../types";

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(() => ({
        classResults: mockClassResults.results,
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
            classResults: mockClassResults.results,
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
    });

    it("renders no times message when no drivers available", () => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: {},
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

        const classResult = mockClassResults.results.SS[0];
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId="test-id"
            />
        );

        expect(screen.getByText("No times available")).toBeVisible();
    });

    it("renders all drivers in class", () => {
        const classResult = mockClassResults.results.SS[0];
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId="test-id"
            />
        );

        // Should render driver names from SS class
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("highlights selected driver", () => {
        const classResult = mockClassResults.results.SS[0];
        const selectedDriverId = `Sarah Johnson|35|SS`;

        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId={selectedDriverId}
            />
        );

        // Find the container div that has the highlight class
        const driverName = screen.getByText("Sarah Johnson");
        const container = driverName.closest("div.relative");
        expect(container).toHaveClass("bg-primary/10");
    });

    it("displays time differences", () => {
        const classResult = mockClassResults.results.SS[0];
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId="test-id"
            />
        );

        // Should show times and gaps
        const timeElements = screen.getAllByText(/\d+\.\d{3}/);
        expect(timeElements.length).toBeGreaterThan(0);
    });

    it("sorts drivers by time", () => {
        const classResult = mockClassResults.results.SS[0];
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId="test-id"
            />
        );

        // First driver should be fastest (lowest time)
        const timeElements = screen.getAllByText(/\d+\.\d{3}/);
        if (timeElements.length > 1) {
            const firstTime = parseFloat(timeElements[0].textContent || "0");
            const secondTime = parseFloat(timeElements[1].textContent || "0");
            expect(firstTime).toBeLessThanOrEqual(secondTime);
        }
    });

    it("displays driver positions", () => {
        const classResult = mockClassResults.results.SS[0];
        renderWithProviders(
            <ClassTimesVisualization
                classResult={classResult}
                selectedDriverId="test-id"
            />
        );

        // Should show position numbers
        const positionElements = screen.getAllByText(/\d+/);
        expect(positionElements.length).toBeGreaterThan(0);
    });
});
