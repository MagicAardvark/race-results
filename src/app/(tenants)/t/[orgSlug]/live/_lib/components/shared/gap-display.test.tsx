import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { GapDisplay } from "./gap-display";

describe("GapDisplay", () => {
    it("renders leader with no gap", () => {
        renderWithProviders(<GapDisplay gapToFirst={0} />);

        // Leader should not show gap text
        expect(screen.queryByText(/First:/)).not.toBeInTheDocument();
    });

    it("renders gap to first", () => {
        renderWithProviders(<GapDisplay gapToFirst={1.234} />);

        expect(screen.getByText(/First: \+1\.234s/)).toBeVisible();
    });

    it("renders gap to next when provided", () => {
        renderWithProviders(
            <GapDisplay gapToFirst={1.234} gapToNext={0.567} />
        );

        expect(screen.getByText(/First: \+1\.234s/)).toBeVisible();
        expect(screen.getByText(/Next: \+0\.567s/)).toBeVisible();
    });

    it("does not render gap to next when zero", () => {
        renderWithProviders(<GapDisplay gapToFirst={1.234} gapToNext={0} />);

        expect(screen.getByText(/First: \+1\.234s/)).toBeVisible();
        expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
    });

    it("handles null gapToFirst", () => {
        renderWithProviders(<GapDisplay gapToFirst={null} />);

        // Should render as leader (no gap text)
        expect(screen.queryByText(/First:/)).not.toBeInTheDocument();
    });

    it("handles undefined gapToFirst", () => {
        renderWithProviders(<GapDisplay gapToFirst={undefined} />);

        // Should render as leader (no gap text)
        expect(screen.queryByText(/First:/)).not.toBeInTheDocument();
    });

    it("uses provided maxGap", () => {
        renderWithProviders(
            <GapDisplay gapToFirst={2.5} maxGap={5.0} allEntries={[]} />
        );

        expect(screen.getByText(/First: \+2\.500s/)).toBeVisible();
    });

    it("calculates maxGap from allEntries when not provided", () => {
        const allEntries = [
            { gapToFirst: 1.0 },
            { gapToFirst: 2.0 },
            { gapToFirst: 3.0 },
            { gapToFirst: 4.0 },
            { gapToFirst: 5.0 },
        ];

        renderWithProviders(
            <GapDisplay gapToFirst={2.5} allEntries={allEntries} />
        );

        expect(screen.getByText(/First: \+2\.500s/)).toBeVisible();
    });

    it("filters out entries with same gap", () => {
        const allEntries = [{ gapToFirst: 1.234 }, { gapToFirst: 2.0 }];

        renderWithProviders(
            <GapDisplay gapToFirst={1.234} allEntries={allEntries} />
        );

        // Should not show duplicate car for same gap
        expect(screen.getByText(/First: \+1\.234s/)).toBeVisible();
    });
});
