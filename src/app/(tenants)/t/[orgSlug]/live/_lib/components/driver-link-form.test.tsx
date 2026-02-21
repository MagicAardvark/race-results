import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { DriverLinkForm } from "./driver-link-form";

const mockDrivers = [
    {
        id: "d1",
        name: "Alice Smith",
        number: "1",
        carClass: "SS",
        car: "Car A",
        color: "Red",
        msrId: "msr-1",
        email: "alice@example.com",
    },
    {
        id: "d2",
        name: "Bob Jones",
        number: "25",
        carClass: "CS",
        car: "Car B",
        color: "Blue",
        msrId: "",
        email: "",
    },
];

describe("DriverLinkForm", () => {
    it("renders default label and submit button", () => {
        const onSelect = vi.fn();
        const onLink = vi.fn();

        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId={null}
                onSelect={onSelect}
                onLink={onLink}
                linking={false}
                error={null}
            />
        );

        expect(screen.getByText("I am this driver")).toBeVisible();
        expect(
            screen.getByRole("button", { name: "This is me" })
        ).toBeVisible();
        expect(screen.getByRole("combobox")).toBeVisible();
    });

    it("shows placeholder in select", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId={null}
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={false}
                error={null}
            />
        );

        expect(screen.getByText("Choose your name…")).toBeVisible();
    });

    it("disables submit when no driver selected", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId={null}
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={false}
                error={null}
            />
        );

        expect(
            screen.getByRole("button", { name: "This is me" })
        ).toBeDisabled();
    });

    it("disables submit when linking", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId="d1"
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={true}
                error={null}
            />
        );

        const button = screen.getByRole("button", { name: "Saving…" });
        expect(button).toBeDisabled();
    });

    it("shows error message when provided", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId={null}
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={false}
                error="Something went wrong"
            />
        );

        expect(screen.getByText("Something went wrong")).toBeVisible();
    });

    it("calls onLink when submit clicked and driver selected", async () => {
        const user = userEvent.setup();
        const onLink = vi.fn();

        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId="d1"
                onSelect={vi.fn()}
                onLink={onLink}
                linking={false}
                error={null}
            />
        );

        await user.click(screen.getByRole("button", { name: "This is me" }));
        expect(onLink).toHaveBeenCalledTimes(1);
    });

    it("uses custom labels when passed", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId={null}
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={false}
                error={null}
                selectLabel="Select your name and retry"
                submitLabel="Retry"
                submitLabelLoading="Retrying…"
            />
        );

        expect(screen.getByText("Select your name and retry")).toBeVisible();
        expect(screen.getByRole("button", { name: "Retry" })).toBeVisible();
    });

    it("shows custom loading label when linking", () => {
        renderWithProviders(
            <DriverLinkForm
                drivers={mockDrivers}
                selectedDriverId="d1"
                onSelect={vi.fn()}
                onLink={vi.fn()}
                linking={true}
                error={null}
                submitLabelLoading="Retrying…"
            />
        );

        expect(screen.getByRole("button", { name: "Retrying…" })).toBeVisible();
    });
});
