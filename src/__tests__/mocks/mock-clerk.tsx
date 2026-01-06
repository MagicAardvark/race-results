import { vi } from "vitest";
import React from "react";

export const mockClerk = {
    user: {
        id: "user_123",
        emailAddresses: [{ emailAddress: "test@example.com" }],
        firstName: "Test",
        lastName: "User",
    },
    isLoaded: true,
    isSignedIn: true,
};

export const mockUseUser = () => ({
    user: mockClerk.user,
    isLoaded: true,
    isSignedIn: true,
});

export const mockUseAuth = () => ({
    userId: "user_123",
    sessionId: "session_123",
    isLoaded: true,
    isSignedIn: true,
});

// Mock Clerk components
export const mockClerkComponents = {
    SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedOut: (_props: { children: React.ReactNode }) => null,
    SignInButton: ({ children }: { children: React.ReactNode }) => (
        <button>{children}</button>
    ),
    UserButton: () => <div data-testid="user-button">User Button</div>,
};

vi.mock("@clerk/nextjs", () => ({
    useUser: mockUseUser,
    useAuth: mockUseAuth,
    SignedIn: mockClerkComponents.SignedIn,
    SignedOut: mockClerkComponents.SignedOut,
    SignInButton: mockClerkComponents.SignInButton,
    UserButton: mockClerkComponents.UserButton,
    ClerkProvider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));
