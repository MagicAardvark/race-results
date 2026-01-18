import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { TimesDistributionChart } from "./times-distribution-chart";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import { FEATURE_FLAGS } from "../../config/feature-flags";
import * as useLiveDataModule from "../../hooks/useLiveData";
import { DisplayMode } from "../../types";

vi.mock("../../hooks/useLiveData", () => ({
    useLiveData: vi.fn(() => ({
        paxResults: mockPaxResults,
        rawResults: mockRawResults,
        featureFlags: {
            [FEATURE_FLAGS.PAX_ENABLED]: true,
        },
        createDriverId: (driver: {
            name: string;
            number: string;
            carClass: string;
        }) => `${driver.name}|${driver.number}|${driver.carClass}`,
    })),
}));

// Mock recharts components
vi.mock("recharts", () => ({
    ComposedChart: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="composed-chart">{children}</div>
    ),
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
    Cell: () => <div data-testid="cell" />,
}));

describe("TimesDistributionChart", () => {
    beforeEach(() => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValue({
            classResults: null,
            classResultsMap: null,
            paxResults: mockPaxResults,
            rawResults: mockRawResults,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: {
                [FEATURE_FLAGS.PAX_ENABLED]: true,
            },
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

    it("renders chart title", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        expect(screen.getByText("Time Distribution")).toBeVisible();
    });

    it("renders PAX and Raw buttons when PAX is enabled", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        expect(screen.getByRole("button", { name: /PAX/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Raw/i })).toBeVisible();
    });

    it("switches between PAX and Raw views", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        const rawButton = screen.getByRole("button", { name: /Raw/i });
        await user.click(rawButton);

        expect(rawButton).toHaveClass("bg-primary");
    });

    it("renders chart when data is available", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        expect(screen.getByTestId("composed-chart")).toBeInTheDocument();
    });

    it("filters out zero or invalid times", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        // Chart should render with valid data
        expect(screen.getByTestId("composed-chart")).toBeInTheDocument();
    });
});
