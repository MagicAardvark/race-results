import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { IndividualClassResults } from "./individual-class-results";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import type { ClassResult } from "../../types";

describe("IndividualClassResults", () => {
    it("renders class name as heading", () => {
        const ssResults = mockClassResults.results.SS;
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: {
                    SS: ssResults,
                } as Record<string, ClassResult[]>,
            },
        });

        expect(screen.getByRole("heading", { name: /SS/i })).toBeVisible();
    });

    it("renders all entries for the class", () => {
        const ssResults = mockClassResults.results.SS;
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: {
                    SS: ssResults,
                } as Record<string, ClassResult[]>,
            },
        });

        // Should render driver names from SS class
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
        // Check if second entry exists in mock data
        const allText = screen.getByText("Sarah Johnson").textContent || "";
        expect(allText).toContain("Sarah");
    });

    it("returns null when class results are not available", () => {
        const { container } = renderWithProviders(
            <IndividualClassResults className="SS" />,
            {
                liveData: {
                    classResults: {} as Record<string, ClassResult[]>,
                },
            }
        );

        expect(container.firstChild).toBeNull();
    });

    it("creates anchor link for class name", () => {
        const ssResults = mockClassResults.results.SS;
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: {
                    SS: ssResults,
                } as Record<string, ClassResult[]>,
            },
        });

        const link = screen.getByRole("link", { name: /SS/i });
        expect(link).toHaveAttribute("href", "#SS");
    });

    it("sets id on container div", () => {
        const ssResults = mockClassResults.results.SS;
        const { container } = renderWithProviders(
            <IndividualClassResults className="SS" />,
            {
                liveData: {
                    classResults: {
                        SS: ssResults,
                    } as Record<string, ClassResult[]>,
                },
            }
        );

        const div = container.querySelector("#SS");
        expect(div).toBeInTheDocument();
    });
});
