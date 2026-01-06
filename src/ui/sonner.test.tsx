import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/__tests__/test-utils";
import { Toaster } from "./sonner";

// Mock next-themes
vi.mock("next-themes", () => ({
    useTheme: vi.fn(() => ({ theme: "system" })),
}));

// Mock sonner - just verify it renders
vi.mock("sonner", () => ({
    Toaster: ({
        children,
        ...props
    }: {
        children?: React.ReactNode;
        [key: string]: unknown;
    }) => (
        <div data-testid="sonner-toaster" {...props}>
            {children}
        </div>
    ),
}));

describe("Toaster", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders Toaster component", () => {
        const { container } = renderWithProviders(<Toaster />);
        const toaster = container.querySelector(
            '[data-testid="sonner-toaster"]'
        );
        expect(toaster).toBeTruthy();
    });

    it("applies className", () => {
        const { container } = renderWithProviders(<Toaster />);
        const toaster = container.querySelector(
            '[data-testid="sonner-toaster"]'
        );
        expect(toaster).toHaveClass("toaster", "group");
    });
});
