import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

describe("Tabs", () => {
    it("renders tabs structure", () => {
        renderWithProviders(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByRole("tab", { name: /Tab 1/i })).toBeVisible();
        expect(screen.getByRole("tab", { name: /Tab 2/i })).toBeVisible();
    });

    it("shows content for default tab", () => {
        renderWithProviders(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByText("Content 1")).toBeVisible();
        expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });

    it("switches tabs when clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        const tab2 = screen.getByRole("tab", { name: /Tab 2/i });
        await user.click(tab2);

        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
        expect(screen.getByText("Content 2")).toBeVisible();
    });

    it("marks active tab with aria-selected", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        const tab1 = screen.getByRole("tab", { name: /Tab 1/i });
        const tab2 = screen.getByRole("tab", { name: /Tab 2/i });

        expect(tab1).toHaveAttribute("aria-selected", "true");
        expect(tab2).toHaveAttribute("aria-selected", "false");

        await user.click(tab2);

        expect(tab1).toHaveAttribute("aria-selected", "false");
        expect(tab2).toHaveAttribute("aria-selected", "true");
    });

    it("supports controlled mode", () => {
        const onValueChange = vi.fn();
        renderWithProviders(
            <Tabs value="tab2" onValueChange={onValueChange}>
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByText("Content 2")).toBeVisible();
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("calls onValueChange in controlled mode", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        renderWithProviders(
            <Tabs value="tab1" onValueChange={onValueChange}>
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        const tab2 = screen.getByRole("tab", { name: /Tab 2/i });
        await user.click(tab2);

        expect(onValueChange).toHaveBeenCalledWith("tab2");
    });
});
