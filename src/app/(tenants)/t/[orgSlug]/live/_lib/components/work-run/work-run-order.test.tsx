import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { WorkRunOrder } from "./work-run-order";
import { mockRunWork } from "@/__tests__/mocks/mock-run-work";
import * as isTodayModule from "../../utils/is-today";

vi.mock("../../utils/is-today", () => ({
    isToday: vi.fn(() => true),
}));

describe("WorkRunOrder", () => {
    beforeEach(() => {
        vi.mocked(isTodayModule.isToday).mockReturnValue(true);
        vi.clearAllMocks();
    });

    it("renders message when event is not today", () => {
        vi.mocked(isTodayModule.isToday).mockReturnValue(false);

        renderWithProviders(<WorkRunOrder />, {
            liveData: {
                runWork: mockRunWork,
            },
        });

        expect(
            screen.getByText(
                /Work\/Run order will be available on the day of the event/i
            )
        ).toBeVisible();
    });

    it("renders work run filter when data is available", () => {
        renderWithProviders(<WorkRunOrder />, {
            liveData: {
                runWork: mockRunWork,
            },
        });

        expect(screen.getByText(/Please select your class/i)).toBeVisible();
    });

    it("renders run and work values when class is selected", async () => {
        const user = userEvent.setup();
        renderWithProviders(<WorkRunOrder />, {
            liveData: {
                runWork: mockRunWork,
            },
        });

        // Click on a class filter button - need to find a class that exists in mockRunWork
        const classKeys = Object.keys(mockRunWork.runWork);
        if (classKeys.length > 0) {
            const classButton = screen.getByRole("button", {
                name: new RegExp(classKeys[0], "i"),
            });
            if (classButton) {
                await user.click(classButton);

                // Should show run and work values
                expect(screen.getByText("Run")).toBeVisible();
                expect(screen.getByText("Work")).toBeVisible();
            }
        }
    });

    it("displays two heats message when numberOfHeats is 2", () => {
        const twoHeatsRunWork = {
            ...mockRunWork,
            numberOfHeats: 2,
        };

        renderWithProviders(<WorkRunOrder />, {
            liveData: {
                runWork: twoHeatsRunWork,
            },
        });

        // Text is split, check for parts
        expect(screen.getByText(/This event will run as/i)).toBeVisible();
        expect(screen.getByText(/two heats/i)).toBeVisible();
    });

    it("displays multiple heats message when numberOfHeats is greater than 2", () => {
        const multiHeatsRunWork = {
            ...mockRunWork,
            numberOfHeats: 3,
        };

        renderWithProviders(<WorkRunOrder />, {
            liveData: {
                runWork: multiHeatsRunWork,
            },
        });

        // The text is split across elements, so check for parts
        expect(screen.getByText(/This event will run as/i)).toBeVisible();
        expect(screen.getByText(/3 heats/i)).toBeVisible();
    });
});
