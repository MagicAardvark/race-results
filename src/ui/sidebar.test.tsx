import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import {
    SidebarProvider,
    Sidebar,
    SidebarTrigger,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarInset,
    useSidebar,
} from "./sidebar";
import userEvent from "@testing-library/user-event";

// Mock useIsMobile hook
vi.mock("@/hooks/use-mobile", () => ({
    useIsMobile: vi.fn(() => false),
}));

describe("Sidebar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear cookies
        document.cookie =
            "sidebar_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    describe("SidebarProvider", () => {
        it("renders children", () => {
            render(
                <SidebarProvider>
                    <div>Test Content</div>
                </SidebarProvider>
            );

            expect(screen.getByText("Test Content")).toBeVisible();
        });

        it("provides sidebar context", () => {
            const TestComponent = () => {
                const sidebar = useSidebar();
                return <div>{sidebar.state}</div>;
            };

            render(
                <SidebarProvider>
                    <TestComponent />
                </SidebarProvider>
            );

            expect(screen.getByText("expanded")).toBeVisible();
        });

        it("starts with defaultOpen state", () => {
            const TestComponent = () => {
                const sidebar = useSidebar();
                return <div>{sidebar.open ? "open" : "closed"}</div>;
            };

            render(
                <SidebarProvider defaultOpen={true}>
                    <TestComponent />
                </SidebarProvider>
            );

            expect(screen.getByText("open")).toBeVisible();
        });

        it("starts closed when defaultOpen is false", () => {
            const TestComponent = () => {
                const sidebar = useSidebar();
                return <div>{sidebar.open ? "open" : "closed"}</div>;
            };

            render(
                <SidebarProvider defaultOpen={false}>
                    <TestComponent />
                </SidebarProvider>
            );

            expect(screen.getByText("closed")).toBeVisible();
        });
    });

    describe("SidebarTrigger", () => {
        it("renders trigger button", () => {
            render(
                <SidebarProvider>
                    <SidebarTrigger />
                </SidebarProvider>
            );

            const button = screen.getByRole("button", {
                name: /toggle sidebar/i,
            });
            expect(button).toBeVisible();
        });

        it("toggles sidebar when clicked", async () => {
            const user = userEvent.setup();
            const TestComponent = () => {
                const sidebar = useSidebar();
                return (
                    <div>
                        <SidebarTrigger />
                        <div>{sidebar.open ? "open" : "closed"}</div>
                    </div>
                );
            };

            render(
                <SidebarProvider defaultOpen={true}>
                    <TestComponent />
                </SidebarProvider>
            );

            expect(screen.getByText("open")).toBeVisible();

            const button = screen.getByRole("button", {
                name: /toggle sidebar/i,
            });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByText("closed")).toBeVisible();
            });
        });

        it("calls onClick handler when provided", async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(
                <SidebarProvider>
                    <SidebarTrigger onClick={handleClick} />
                </SidebarProvider>
            );

            const button = screen.getByRole("button", {
                name: /toggle sidebar/i,
            });
            await user.click(button);

            await waitFor(() => {
                expect(handleClick).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Sidebar component", () => {
        it("renders sidebar content", () => {
            render(
                <SidebarProvider>
                    <Sidebar>
                        <SidebarContent>Test Content</SidebarContent>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Test Content")).toBeVisible();
        });

        it("renders with collapsible offExamples", () => {
            render(
                <SidebarProvider>
                    <Sidebar collapsible="offExamples">
                        <SidebarContent>Content</SidebarContent>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Content")).toBeVisible();
        });

        it("renders with collapsible none", () => {
            render(
                <SidebarProvider>
                    <Sidebar collapsible="none">
                        <SidebarContent>Content</SidebarContent>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Content")).toBeVisible();
        });
    });

    describe("Sidebar sub-components", () => {
        it("renders SidebarContent", () => {
            render(
                <SidebarProvider>
                    <Sidebar>
                        <SidebarContent>Content</SidebarContent>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Content")).toBeVisible();
        });

        it("renders SidebarHeader", () => {
            render(
                <SidebarProvider>
                    <Sidebar>
                        <SidebarHeader>Header</SidebarHeader>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Header")).toBeVisible();
        });

        it("renders SidebarFooter", () => {
            render(
                <SidebarProvider>
                    <Sidebar>
                        <SidebarFooter>Footer</SidebarFooter>
                    </Sidebar>
                </SidebarProvider>
            );

            expect(screen.getByText("Footer")).toBeVisible();
        });

        it("renders SidebarInset", () => {
            render(
                <SidebarProvider>
                    <SidebarInset>Inset Content</SidebarInset>
                </SidebarProvider>
            );

            expect(screen.getByText("Inset Content")).toBeVisible();
        });
    });

    describe("useSidebar hook", () => {
        it("throws error when used outside provider", () => {
            // Suppress console.error for this test
            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            const TestComponent = () => {
                useSidebar();
                return null;
            };

            expect(() => {
                render(<TestComponent />);
            }).toThrow("useSidebar must be used within a SidebarProvider");

            consoleSpy.mockRestore();
        });
    });
});
