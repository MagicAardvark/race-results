import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveResultsProvider, useLiveResults } from "./live-results-context";
import { DisplayMode } from "../types";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

function TestComponent() {
    const context = useLiveResults();
    return (
        <div>
            <div data-testid="class-results">
                {context.classResults ? "has-class" : "no-class"}
            </div>
            <div data-testid="pax-results">
                {context.paxResults ? "has-pax" : "no-pax"}
            </div>
            <div data-testid="raw-results">
                {context.rawResults ? "has-raw" : "no-raw"}
            </div>
            <div data-testid="display-mode">{context.displayMode}</div>
        </div>
    );
}

describe("LiveResultsProvider", () => {
    it("provides class results to children", () => {
        render(
            <LiveResultsProvider
                classResults={mockClassResults}
                paxResults={null}
                rawResults={null}
                runWork={null}
                displayMode={DisplayMode.autocross}
            >
                <TestComponent />
            </LiveResultsProvider>
        );

        expect(screen.getByTestId("class-results")).toHaveTextContent(
            "has-class"
        );
    });

    it("provides pax results to children", () => {
        render(
            <LiveResultsProvider
                classResults={null}
                paxResults={mockPaxResults}
                rawResults={null}
                runWork={null}
                displayMode={DisplayMode.autocross}
            >
                <TestComponent />
            </LiveResultsProvider>
        );

        expect(screen.getByTestId("pax-results")).toHaveTextContent("has-pax");
    });

    it("provides raw results to children", () => {
        render(
            <LiveResultsProvider
                classResults={null}
                paxResults={null}
                rawResults={mockRawResults}
                runWork={null}
                displayMode={DisplayMode.autocross}
            >
                <TestComponent />
            </LiveResultsProvider>
        );

        expect(screen.getByTestId("raw-results")).toHaveTextContent("has-raw");
    });

    it("provides display mode to children", () => {
        render(
            <LiveResultsProvider
                classResults={null}
                paxResults={null}
                rawResults={null}
                runWork={null}
                displayMode={DisplayMode.rallycross}
            >
                <TestComponent />
            </LiveResultsProvider>
        );

        expect(screen.getByTestId("display-mode")).toHaveTextContent(
            "rallycross"
        );
    });

    it("provides feature flags to children", () => {
        function FeatureFlagTest() {
            const context = useLiveResults();
            return (
                <div data-testid="feature-flag">
                    {context.featureFlags.testFlag ? "enabled" : "disabled"}
                </div>
            );
        }

        render(
            <LiveResultsProvider
                classResults={null}
                paxResults={null}
                rawResults={null}
                runWork={null}
                displayMode={DisplayMode.autocross}
                featureFlags={{ testFlag: true }}
            >
                <FeatureFlagTest />
            </LiveResultsProvider>
        );

        expect(screen.getByTestId("feature-flag")).toHaveTextContent("enabled");
    });
});

describe("useLiveResults", () => {
    it("throws error when used outside provider", () => {
        // Suppress console.error for this test
        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useLiveResults must be used within a LiveResultsProvider");

        consoleSpy.mockRestore();
    });
});
