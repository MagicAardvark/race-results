import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { RunStatisticsCard } from "./run-statistics-card";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

describe("RunStatisticsCard", () => {
    it("renders title", () => {
        render(<RunStatisticsCard classResult={null} rawResult={null} />);

        expect(screen.getByText("Run Statistics")).toBeVisible();
    });

    it("displays total runs from class result", () => {
        const classResult = mockClassResults.results.SS[0];
        render(
            <RunStatisticsCard classResult={classResult} rawResult={null} />
        );

        expect(screen.getByText("Total Runs")).toBeVisible();
        expect(
            screen.getByText(classResult.runInfo.runs.length.toString())
        ).toBeVisible();
    });

    it("displays clean runs count", () => {
        const classResult = mockClassResults.results.SS[0];
        render(
            <RunStatisticsCard classResult={classResult} rawResult={null} />
        );

        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(
            screen.getByText(classResult.runInfo.cleanCount.toString())
        ).toBeVisible();
    });

    it("displays cone count from class result", () => {
        const classResult = mockClassResults.results.SS[0];
        render(
            <RunStatisticsCard classResult={classResult} rawResult={null} />
        );

        expect(screen.getByText("Cone Count")).toBeVisible();
        expect(
            screen.getByText(classResult.runInfo.coneCount.toString())
        ).toBeVisible();
    });

    it("displays cone count from raw result when class result is null", () => {
        const rawResult = mockRawResults.results[0];
        render(<RunStatisticsCard classResult={null} rawResult={rawResult} />);

        expect(screen.getByText("Cone Count")).toBeVisible();
        const coneCountLabel = screen.getByText("Cone Count");
        const coneCountValue =
            coneCountLabel.parentElement?.querySelector(".font-bold");
        expect(coneCountValue).toHaveTextContent(
            rawResult.coneCount.toString()
        );
    });

    it("displays DNF count", () => {
        const classResult = mockClassResults.results.SS[0];
        render(
            <RunStatisticsCard classResult={classResult} rawResult={null} />
        );

        expect(screen.getByText("DNF Count")).toBeVisible();
        expect(
            screen.getByText(classResult.runInfo.dnfCount.toString())
        ).toBeVisible();
    });

    it("displays N/A for clean runs when class result is null", () => {
        render(<RunStatisticsCard classResult={null} rawResult={null} />);

        expect(screen.getByText("Clean Runs")).toBeVisible();
        const cleanRunsLabel = screen.getByText("Clean Runs");
        const cleanRunsValue =
            cleanRunsLabel.parentElement?.querySelector(".font-bold");
        expect(cleanRunsValue).toHaveTextContent("N/A");
    });

    it("displays N/A for DNF count when class result is null", () => {
        render(<RunStatisticsCard classResult={null} rawResult={null} />);

        expect(screen.getByText("DNF Count")).toBeVisible();
        const dnfLabel = screen.getByText("DNF Count");
        const dnfValue = dnfLabel.parentElement?.querySelector(".font-bold");
        expect(dnfValue).toHaveTextContent("N/A");
    });

    it("displays zero for total runs when class result is null", () => {
        render(<RunStatisticsCard classResult={null} rawResult={null} />);

        expect(screen.getByText("Total Runs")).toBeVisible();
        const totalRunsLabel = screen.getByText("Total Runs");
        const totalRunsValue =
            totalRunsLabel.parentElement?.querySelector(".font-bold");
        expect(totalRunsValue).toHaveTextContent("0");
    });
});
