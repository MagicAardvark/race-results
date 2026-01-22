import { describe, it, expect, vi } from "vitest";
import { AppHeader } from "./app-header";
import {
    mockAdminUser,
    createMockUserWithExtendedDetails,
} from "@/__tests__/mocks/mock-users";
import React from "react";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
}));
vi.mock("@clerk/nextjs", () => ({
    SignedIn: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SignedOut: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SignInButton: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    UserButton: () => <div>UserButton</div>,
}));
vi.mock("next/link", () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

describe("AppHeader", () => {
    it("returns JSX element", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(null);

        const Header = await AppHeader({});

        expect(Header).toBeDefined();
        expect(React.isValidElement(Header)).toBe(true);
    });

    it("handles admin user", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);

        const Header = await AppHeader({});

        expect(Header).toBeDefined();
        expect(React.isValidElement(Header)).toBe(true);
    });

    it("handles non-admin user", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(
            createMockUserWithExtendedDetails({ roles: ["user"] })
        );

        const Header = await AppHeader({});

        expect(Header).toBeDefined();
        expect(React.isValidElement(Header)).toBe(true);
    });

    it("handles sidebar trigger", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(null);

        const trigger = <button>Menu</button>;
        const Header = await AppHeader({ sidebarTrigger: trigger });

        expect(Header).toBeDefined();
        expect(React.isValidElement(Header)).toBe(true);
    });
});
