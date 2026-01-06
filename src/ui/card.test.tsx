import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardContent,
    CardFooter,
} from "./card";

describe("Card", () => {
    it("renders card element", () => {
        renderWithProviders(<Card data-testid="card">Card Content</Card>);
        const card = screen.getByTestId("card");
        expect(card).toBeVisible();
        expect(card).toHaveAttribute("data-slot", "card");
    });

    it("renders with default size", () => {
        renderWithProviders(<Card data-testid="card">Content</Card>);
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-size", "default");
    });

    it("renders with small size", () => {
        renderWithProviders(
            <Card size="sm" data-testid="card">
                Content
            </Card>
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-size", "sm");
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Card className="custom-class" data-testid="card">
                Content
            </Card>
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveClass("custom-class");
    });
});

describe("CardHeader", () => {
    it("renders header element", () => {
        renderWithProviders(
            <Card>
                <CardHeader data-testid="header">Header</CardHeader>
            </Card>
        );
        const header = screen.getByTestId("header");
        expect(header).toBeVisible();
        expect(header).toHaveAttribute("data-slot", "card-header");
    });
});

describe("CardTitle", () => {
    it("renders title element", () => {
        renderWithProviders(
            <Card>
                <CardHeader>
                    <CardTitle data-testid="title">Card Title</CardTitle>
                </CardHeader>
            </Card>
        );
        const title = screen.getByTestId("title");
        expect(title).toBeVisible();
        expect(title).toHaveAttribute("data-slot", "card-title");
        expect(title).toHaveTextContent("Card Title");
    });
});

describe("CardDescription", () => {
    it("renders description element", () => {
        renderWithProviders(
            <Card>
                <CardHeader>
                    <CardDescription data-testid="description">
                        Card Description
                    </CardDescription>
                </CardHeader>
            </Card>
        );
        const description = screen.getByTestId("description");
        expect(description).toBeVisible();
        expect(description).toHaveAttribute("data-slot", "card-description");
        expect(description).toHaveTextContent("Card Description");
    });
});

describe("CardAction", () => {
    it("renders action element", () => {
        renderWithProviders(
            <Card>
                <CardHeader>
                    <CardAction data-testid="action">Action</CardAction>
                </CardHeader>
            </Card>
        );
        const action = screen.getByTestId("action");
        expect(action).toBeVisible();
        expect(action).toHaveAttribute("data-slot", "card-action");
    });
});

describe("CardContent", () => {
    it("renders content element", () => {
        renderWithProviders(
            <Card>
                <CardContent data-testid="content">Card Content</CardContent>
            </Card>
        );
        const content = screen.getByTestId("content");
        expect(content).toBeVisible();
        expect(content).toHaveAttribute("data-slot", "card-content");
        expect(content).toHaveTextContent("Card Content");
    });
});

describe("CardFooter", () => {
    it("renders footer element", () => {
        renderWithProviders(
            <Card>
                <CardFooter data-testid="footer">Footer</CardFooter>
            </Card>
        );
        const footer = screen.getByTestId("footer");
        expect(footer).toBeVisible();
        expect(footer).toHaveAttribute("data-slot", "card-footer");
        expect(footer).toHaveTextContent("Footer");
    });
});
