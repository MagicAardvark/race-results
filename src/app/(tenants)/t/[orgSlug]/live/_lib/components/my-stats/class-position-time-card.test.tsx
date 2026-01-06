import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { ClassPositionTimeCard } from "./class-position-time-card";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: () => ({
        displayMode: "autocross",
        classResults: mockClassResults.results,
        rawResults: mockRawResults.results,
        createDriverId: (driver: { name: string; number: string }) =>
            `${driver.name}-${driver.number}`,
    }),
}));

describe("ClassPositionTimeCard", () => {
    it("renders class position and time", () => {
        const classResult = mockClassResults.results.SS[0];
        const rawResult = mockRawResults.results[0];

        renderWithProviders(
            <ClassPositionTimeCard
                classResult={classResult}
                rawResult={rawResult}
            />
        );

        expect(screen.getByText("Class")).toBeVisible();
        expect(screen.getByText(classResult.position)).toBeVisible();
    });

    it("renders best time from class result", () => {
        const classResult = mockClassResults.results.SS[0];
        const rawResult = mockRawResults.results[0];

        renderWithProviders(
            <ClassPositionTimeCard
                classResult={classResult}
                rawResult={rawResult}
            />
        );

        // Best time should be visible (from runInfo.total or best run)
        expect(screen.getByText("Best Time")).toBeVisible();
    });

    it("renders gap to first in class for autocross mode", () => {
        const classResult = mockClassResults.results.SS[0];
        const rawResult = mockRawResults.results[0];

        renderWithProviders(
            <ClassPositionTimeCard
                classResult={classResult}
                rawResult={rawResult}
            />
        );

        // Gap should be displayed if toFirstInClass is set
        if (classResult.runInfo.toFirstInClass > 0) {
            expect(screen.getByText(/\+.*s from first/i)).toBeVisible();
        }
    });

    it("handles null class result", () => {
        const rawResult = mockRawResults.results[0];

        renderWithProviders(
            <ClassPositionTimeCard classResult={null} rawResult={rawResult} />
        );

        expect(screen.getByText("Class")).toBeVisible();
        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("handles null raw result", () => {
        const classResult = mockClassResults.results.SS[0];

        renderWithProviders(
            <ClassPositionTimeCard classResult={classResult} rawResult={null} />
        );

        expect(screen.getByText("Class")).toBeVisible();
    });

    it("handles both null results", () => {
        renderWithProviders(
            <ClassPositionTimeCard classResult={null} rawResult={null} />
        );

        expect(screen.getByText("Class")).toBeVisible();
        expect(screen.getByText("N/A")).toBeVisible();
    });
});
