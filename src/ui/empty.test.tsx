import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
} from "./empty";

describe("Empty", () => {
    it("renders empty element", () => {
        renderWithProviders(<Empty data-testid="empty">Content</Empty>);
        const empty = screen.getByTestId("empty");
        expect(empty).toBeVisible();
        expect(empty).toHaveAttribute("data-slot", "empty");
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Empty className="custom-class" data-testid="empty">
                Content
            </Empty>
        );
        const empty = screen.getByTestId("empty");
        expect(empty).toHaveClass("custom-class");
    });
});

describe("EmptyHeader", () => {
    it("renders header element", () => {
        renderWithProviders(
            <Empty>
                <EmptyHeader data-testid="header">Header</EmptyHeader>
            </Empty>
        );
        const header = screen.getByTestId("header");
        expect(header).toBeVisible();
        expect(header).toHaveAttribute("data-slot", "empty-header");
    });
});

describe("EmptyTitle", () => {
    it("renders title element", () => {
        renderWithProviders(
            <Empty>
                <EmptyHeader>
                    <EmptyTitle data-testid="title">Empty Title</EmptyTitle>
                </EmptyHeader>
            </Empty>
        );
        const title = screen.getByTestId("title");
        expect(title).toBeVisible();
        expect(title).toHaveAttribute("data-slot", "empty-title");
        expect(title).toHaveTextContent("Empty Title");
    });
});

describe("EmptyDescription", () => {
    it("renders description element", () => {
        renderWithProviders(
            <Empty>
                <EmptyHeader>
                    <EmptyDescription data-testid="description">
                        Empty Description
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
        const description = screen.getByTestId("description");
        expect(description).toBeVisible();
        expect(description).toHaveAttribute("data-slot", "empty-description");
        expect(description).toHaveTextContent("Empty Description");
    });
});

describe("EmptyContent", () => {
    it("renders content element", () => {
        renderWithProviders(
            <Empty>
                <EmptyContent data-testid="content">Content</EmptyContent>
            </Empty>
        );
        const content = screen.getByTestId("content");
        expect(content).toBeVisible();
        expect(content).toHaveAttribute("data-slot", "empty-content");
    });
});

describe("EmptyMedia", () => {
    it("renders media element with default variant", () => {
        renderWithProviders(
            <Empty>
                <EmptyMedia data-testid="media">Icon</EmptyMedia>
            </Empty>
        );
        const media = screen.getByTestId("media");
        expect(media).toBeVisible();
        expect(media).toHaveAttribute("data-slot", "empty-icon");
        expect(media).toHaveAttribute("data-variant", "default");
    });

    it("renders media element with icon variant", () => {
        renderWithProviders(
            <Empty>
                <EmptyMedia variant="icon" data-testid="media">
                    Icon
                </EmptyMedia>
            </Empty>
        );
        const media = screen.getByTestId("media");
        expect(media).toHaveAttribute("data-variant", "icon");
    });
});
