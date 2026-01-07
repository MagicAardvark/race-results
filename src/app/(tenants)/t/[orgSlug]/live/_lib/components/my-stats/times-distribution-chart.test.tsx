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
        paxResults: mockPaxResults.results,
        rawResults: mockRawResults.results,
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
            paxResults: mockPaxResults.results,
            rawResults: mockRawResults.results,
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

    it("renders chart components", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        expect(screen.getByTestId("composed-chart")).toBeVisible();
    });

    it("renders no times message when no data available", () => {
        vi.mocked(useLiveDataModule.useLiveData).mockReturnValueOnce({
            classResults: null,
            paxResults: null,
            rawResults: null,
            runWork: null,
            displayMode: DisplayMode.autocross,
            featureFlags: { [FEATURE_FLAGS.PAX_ENABLED]: true },
            classNames: [],
            getAllDrivers: vi.fn(),
            findDriverInClassResults: vi.fn(),
            findDriverInPaxResults: vi.fn(),
            findDriverInRawResults: vi.fn(),
            createDriverId: () => "",
        } as ReturnType<typeof useLiveDataModule.useLiveData>);

        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        expect(screen.getByText("No times available")).toBeVisible();
    });

    it("switches to Raw when Raw button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        const rawButton = screen.getByRole("button", { name: /Raw/i });
        await user.click(rawButton);

        expect(rawButton).toBeVisible();
    });

    it("switches to PAX when PAX button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="test-id" />
        );

        const paxButton = screen.getByRole("button", { name: /PAX/i });
        await user.click(paxButton);

        expect(paxButton).toBeVisible();
    });

    it("renders chart with histogram data", () => {
        renderWithProviders(
            <TimesDistributionChart selectedDriverId="Alex Martinez|2|DST" />
        );

        expect(screen.getByTestId("composed-chart")).toBeVisible();
        expect(screen.getByTestId("bar")).toBeVisible();
        expect(screen.getByTestId("x-axis")).toBeVisible();
        expect(screen.getByTestId("y-axis")).toBeVisible();
    });
});
