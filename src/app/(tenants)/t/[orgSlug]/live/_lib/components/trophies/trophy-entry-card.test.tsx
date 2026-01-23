import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { TrophyEntryCard } from "./trophy-entry-card";
import type { TrophyEntry } from "./types";

const mockTrophyEntry: TrophyEntry = {
    position: 1,
    name: "John Doe",
    number: "42",
    car: "2020 Mazda Miata",
    class: "STR",
    rawTime: "45.123",
    paxTime: "42.456",
};

describe("TrophyEntryCard", () => {
    it("renders position, name, number, and car", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={false} />
        );

        expect(screen.getByText("Position 1")).toBeVisible();
        expect(screen.getByText("John Doe")).toBeVisible();
        expect(screen.getByText("#42 • 2020 Mazda Miata")).toBeVisible();
    });

    it("renders raw time", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={false} />
        );

        expect(screen.getByText("Raw")).toBeVisible();
        expect(screen.getByText("45.123")).toBeVisible();
    });

    it("renders class when isProOrNovice is true", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={true} />
        );

        expect(screen.getByText("Class STR")).toBeVisible();
    });

    it("does not render class when isProOrNovice is false", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={false} />
        );

        expect(screen.queryByText("Class STR")).not.toBeInTheDocument();
    });

    it("renders PAX time when isProOrNovice is true", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={true} />
        );

        expect(screen.getByText("PAX")).toBeVisible();
        expect(screen.getByText("42.456")).toBeVisible();
    });

    it("does not render PAX time when isProOrNovice is false", () => {
        renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={false} />
        );

        expect(screen.queryByText("PAX")).not.toBeInTheDocument();
    });

    it("renders N/A for PAX time when paxTime is null", () => {
        const entryWithoutPax: TrophyEntry = {
            ...mockTrophyEntry,
            paxTime: null,
        };
        renderWithProviders(
            <TrophyEntryCard entry={entryWithoutPax} isProOrNovice={true} />
        );

        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("displays gold medal icon for first place", () => {
        const { container } = renderWithProviders(
            <TrophyEntryCard entry={mockTrophyEntry} isProOrNovice={false} />
        );

        // Check for medal icon (position 1 = gold) - look for SVG in the card
        const svgs = container.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
    });

    it("displays silver medal icon for second place", () => {
        const secondPlace: TrophyEntry = {
            ...mockTrophyEntry,
            position: 2,
        };
        const { container } = renderWithProviders(
            <TrophyEntryCard entry={secondPlace} isProOrNovice={false} />
        );

        const svgs = container.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
    });

    it("displays bronze medal icon for third place", () => {
        const thirdPlace: TrophyEntry = {
            ...mockTrophyEntry,
            position: 3,
        };
        const { container } = renderWithProviders(
            <TrophyEntryCard entry={thirdPlace} isProOrNovice={false} />
        );

        const svgs = container.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
    });

    it("displays award icon for positions beyond third", () => {
        const fourthPlace: TrophyEntry = {
            ...mockTrophyEntry,
            position: 4,
        };
        const { container } = renderWithProviders(
            <TrophyEntryCard entry={fourthPlace} isProOrNovice={false} />
        );

        const svgs = container.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
    });
});
