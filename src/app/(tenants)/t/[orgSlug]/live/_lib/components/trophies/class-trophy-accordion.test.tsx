import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassTrophyAccordion } from "./class-trophy-accordion";
import type { TrophyClassData } from "./types";

const mockTrophyData: TrophyClassData[] = [
    {
        className: "STR",
        classLongName: "Street Touring R",
        entries: [
            {
                position: 1,
                name: "John Doe",
                number: "42",
                car: "2020 Mazda Miata",
                class: "STR",
                rawTime: "45.123",
                paxTime: "42.456",
            },
            {
                position: 2,
                name: "Jane Smith",
                number: "99",
                car: "2021 Honda Civic",
                class: "STR",
                rawTime: "46.789",
                paxTime: "43.123",
            },
        ],
        totalDrivers: 10,
        trophyCount: 2,
    },
    {
        className: "SS",
        classLongName: "Super Street",
        entries: [
            {
                position: 1,
                name: "Bob Johnson",
                number: "5",
                car: "2022 Porsche GT4",
                class: "SS",
                rawTime: "44.567",
                paxTime: null,
            },
        ],
        totalDrivers: 5,
        trophyCount: 1,
    },
];

describe("ClassTrophyAccordion", () => {
    beforeEach(() => {
        // Mock window.scrollTo
        window.scrollTo = vi.fn();
    });

    it("renders all class cards", () => {
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        expect(screen.getByText("Street Touring R")).toBeVisible();
        expect(screen.getByText("Super Street")).toBeVisible();
    });

    it("opens first class by default", () => {
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        // First class should be open
        expect(screen.getByText("John Doe")).toBeVisible();
        expect(screen.getByText("Jane Smith")).toBeVisible();
    });

    it("displays trophy count and driver count", () => {
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        expect(screen.getByText(/2 trophies \/ 10 drivers/)).toBeVisible();
        expect(screen.getByText(/1 trophy \/ 5 driver/)).toBeVisible();
    });

    it("toggles accordion when clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        // Initially STR should be open
        expect(screen.getByText("John Doe")).toBeVisible();

        // Click SS to open it
        const ssButton = screen.getByText("Super Street").closest("button");
        if (ssButton) {
            await user.click(ssButton);
            // SS should now be open
            expect(screen.getByText("Bob Johnson")).toBeVisible();
        }
    });

    it("returns to default when clicking the same class", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        // Initially STR should be open (default)
        expect(screen.getByText("John Doe")).toBeVisible();

        // Click SS to open it
        const ssButton = screen.getByText("Super Street").closest("button");
        if (ssButton) {
            await user.click(ssButton);
            // SS should now be open
            expect(screen.getByText("Bob Johnson")).toBeVisible();
        }

        // Click SS again - it should return to default (STR)
        const ssButtonAgain = screen
            .getByText("Super Street")
            .closest("button");
        if (ssButtonAgain) {
            await user.click(ssButtonAgain);
            // Should return to default (STR)
            expect(screen.getByText("John Doe")).toBeVisible();
        }
    });

    it("renders trophy entries for open class", () => {
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        // First class (STR) should be open by default
        expect(screen.getByText("Position 1")).toBeVisible();
        expect(screen.getByText("Position 2")).toBeVisible();
    });

    it("applies dark background when accordion is open", () => {
        renderWithProviders(
            <ClassTrophyAccordion trophyData={mockTrophyData} />
        );

        // First class should have dark background
        const strCard = screen
            .getByText("Street Touring R")
            .closest("div[class*='bg-orange']");
        expect(strCard).toBeInTheDocument();
    });

    it("handles empty trophy data", () => {
        renderWithProviders(<ClassTrophyAccordion trophyData={[]} />);

        expect(screen.queryByText("Street Touring R")).not.toBeInTheDocument();
    });

    it("displays correct trophy count text for singular trophy", () => {
        const singleTrophyData: TrophyClassData[] = [
            {
                className: "SS",
                classLongName: "Super Street",
                entries: [
                    {
                        position: 1,
                        name: "Bob Johnson",
                        number: "5",
                        car: "2022 Porsche GT4",
                        class: "SS",
                        rawTime: "44.567",
                        paxTime: null,
                    },
                ],
                totalDrivers: 1,
                trophyCount: 1,
            },
        ];

        renderWithProviders(
            <ClassTrophyAccordion trophyData={singleTrophyData} />
        );

        expect(screen.getByText(/1 trophy \/ 1 driver/)).toBeVisible();
    });
});
