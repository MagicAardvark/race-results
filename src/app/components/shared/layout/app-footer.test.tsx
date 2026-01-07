import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { AppFooter } from "./app-footer";

describe("AppFooter", () => {
    it("renders footer with branding", () => {
        render(<AppFooter />);

        expect(screen.getByText("Race Results")).toBeVisible();
    });

    it("renders quick links", () => {
        render(<AppFooter />);

        expect(screen.getByText("Quick Links")).toBeVisible();
        expect(screen.getByText("Organizations")).toBeVisible();
        expect(screen.getByText("Events")).toBeVisible();
        expect(screen.getByText("Results")).toBeVisible();
        expect(screen.getByText("Live Timing")).toBeVisible();
    });

    it("renders social media links", () => {
        render(<AppFooter />);

        expect(screen.getByText("Connect")).toBeVisible();
        const facebookLink = screen.getByTitle("Visit us on Facebook");
        const instagramLink = screen.getByTitle("Visit us on Instagram");

        expect(facebookLink).toBeVisible();
        expect(instagramLink).toBeVisible();
    });

    it("renders copyright notice", () => {
        render(<AppFooter />);

        const currentYear = new Date().getFullYear();
        expect(
            screen.getByText(new RegExp(`© ${currentYear} Race Results`))
        ).toBeVisible();
    });
});
