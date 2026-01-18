import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { IndividualClassResults } from "./individual-class-results";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";

describe("IndividualClassResults", () => {
    it("renders class name as heading", () => {
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: mockClassResults,
            },
        });

        expect(
            screen.getByRole("heading", { name: /Super Street/i })
        ).toBeVisible();
    });

    it("renders all entries for the class", () => {
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: mockClassResults,
            },
        });

        // Should render driver names from SS class
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
        expect(screen.getByText("Michael Chen")).toBeVisible();
    });

    it("returns null when class results are not available", () => {
        const { container } = renderWithProviders(
            <IndividualClassResults className="SS" />,
            {
                liveData: {
                    classResults: null,
                },
            }
        );

        expect(container.firstChild).toBeNull();
    });

    it("creates anchor link for class name", () => {
        renderWithProviders(<IndividualClassResults className="SS" />, {
            liveData: {
                classResults: mockClassResults,
            },
        });

        const link = screen.getByRole("link", { name: /Super Street/i });
        expect(link).toHaveAttribute("href", "#SS");
    });

    it("sets id on container div", () => {
        const { container } = renderWithProviders(
            <IndividualClassResults className="SS" />,
            {
                liveData: {
                    classResults: mockClassResults,
                },
            }
        );

        const div = container.querySelector("#SS");
        expect(div).toBeInTheDocument();
    });
});
