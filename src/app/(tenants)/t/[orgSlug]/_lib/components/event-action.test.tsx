import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { EventExternalLink, ComingSoonBadge } from "./event-action";

describe("EventExternalLink", () => {
    it("renders label and links to href", () => {
        render(
            <EventExternalLink
                href="https://motorsportreg.com/event/123"
                label="View event & sign up"
            />
        );

        const link = screen.getByRole("link", { name: /View event & sign up/ });
        expect(link).toBeVisible();
        expect(link).toHaveAttribute("href", "https://motorsportreg.com/event/123");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders with outline variant", () => {
        render(
            <EventExternalLink
                href="https://example.com"
                label="View event"
                variant="outline"
            />
        );

        expect(screen.getByRole("link", { name: /View event/ })).toBeVisible();
    });
});

describe("ComingSoonBadge", () => {
    it("renders label", () => {
        render(<ComingSoonBadge label="Sign up coming soon" />);

        expect(screen.getByText("Sign up coming soon")).toBeVisible();
    });

    it("renders with xs size", () => {
        render(<ComingSoonBadge label="Event details coming soon" size="xs" />);

        expect(screen.getByText("Event details coming soon")).toBeVisible();
    });
});
