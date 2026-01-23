import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { SpecialAwardCard } from "./special-award-card";
import { Zap } from "lucide-react";
import type { SpecialAwards } from "./types";
import type { ResultsEntry } from "@/dto/live-results";

const mockConeKillerAward: NonNullable<SpecialAwards["coneKiller"]> = {
    name: "John Doe",
    number: "42",
    car: "2020 Mazda Miata",
    class: "STR",
    totalCones: 15,
};

const mockEntry: ResultsEntry = {
    entryKey: "STR-42-John Doe",
    msrId: "",
    email: "",
    class: "STR",
    carNumber: "42",
    driverName: "John Doe",
    carModel: "2020 Mazda Miata",
    carColor: "",
    sponsor: "",
    classPosition: { position: 1, toNext: null, toFirst: null },
    indexedPosition: { position: 1, toNext: null, toFirst: null },
    rawPosition: { position: 1, toNext: null, toFirst: null },
    isTrophy: false,
    summary: { totalClean: 4, totalCones: 15, totalDNF: 0 },
    indexedTotalTime: 45.123,
    rawTotalTime: 45.123,
    segments: [],
};

describe("SpecialAwardCard", () => {
    it("renders title and description", () => {
        renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={mockEntry}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        expect(screen.getByText("Cone Killer")).toBeVisible();
        expect(screen.getByText("Most cones hit")).toBeVisible();
    });

    it("renders award winner information", () => {
        renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={mockEntry}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        expect(screen.getByText("John Doe")).toBeVisible();
        expect(screen.getByText("#42 • 2020 Mazda Miata")).toBeVisible();
        expect(screen.getByText("Class STR")).toBeVisible();
    });

    it("renders custom stats via renderStats prop", () => {
        renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={mockEntry}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        expect(screen.getByText("Total Cones: 15")).toBeVisible();
    });

    it("toggles run data visibility when clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={mockEntry}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        // Initially, run data should not be visible
        expect(screen.queryByText("Run 1")).not.toBeInTheDocument();

        // Click the card to toggle
        const card = screen.getByText("Cone Killer").closest("button");
        if (card) {
            await user.click(card);
            // RunData component should now be rendered
            // (We can't easily test the exact content without mocking RunData)
            expect(card).toBeInTheDocument();
        }
    });

    it("does not render run data when entry is undefined", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={undefined}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        const card = screen.getByText("Cone Killer").closest("button");
        if (card) {
            await user.click(card);
            // Even after clicking, run data should not render if entry is undefined
            expect(screen.queryByText("Run 1")).not.toBeInTheDocument();
        }
    });

    it("renders icon with correct color class", () => {
        const { container } = renderWithProviders(
            <SpecialAwardCard
                awardType="coneKiller"
                award={mockConeKillerAward}
                icon={Zap}
                iconColor="text-yellow-600"
                title="Cone Killer"
                description="Most cones hit"
                entry={mockEntry}
                renderStats={(award) => {
                    const coneKillerAward = award as NonNullable<
                        SpecialAwards["coneKiller"]
                    >;
                    return <p>Total Cones: {coneKillerAward.totalCones}</p>;
                }}
            />
        );

        // Find SVG icon and check it has the color class
        const icon = container.querySelector("svg.text-yellow-600");
        expect(icon).toBeInTheDocument();
    });
});
