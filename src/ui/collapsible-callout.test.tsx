import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { CollapsibleCallout } from "./collapsible-callout";

describe("CollapsibleCallout", () => {
    it("renders title and hides content by default", () => {
        renderWithProviders(
            <CollapsibleCallout title="Summary title">
                <p>Hidden content</p>
            </CollapsibleCallout>
        );

        expect(screen.getByText("Summary title")).toBeVisible();
        expect(screen.getByText("Hidden content")).toBeInTheDocument();
    });

    it("shows content when summary is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <CollapsibleCallout title="Click to expand">
                <p>Expanded content</p>
            </CollapsibleCallout>
        );

        const summary = screen.getByText("Click to expand");
        await user.click(summary);

        expect(screen.getByText("Expanded content")).toBeVisible();
    });

    it("renders as details/summary for accessibility", () => {
        renderWithProviders(
            <CollapsibleCallout title="Details">
                <span>Body</span>
            </CollapsibleCallout>
        );

        const details = document.querySelector("details");
        const summary = document.querySelector("summary");
        expect(details).toBeInTheDocument();
        expect(summary).toBeInTheDocument();
        expect(summary).toHaveTextContent("Details");
    });
});
