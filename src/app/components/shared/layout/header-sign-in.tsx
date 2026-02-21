"use client";

import { usePathname } from "next/navigation";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/ui/button";

/**
 * Renders the header Sign In button only when the user is signed out and not on
 * a /live route (which has its own sign-in CTA to avoid duplicate buttons).
 */
export function HeaderSignIn() {
    const pathname = usePathname();
    const isLiveRoute = pathname?.includes("/live") ?? false;

    if (isLiveRoute) return null;

    return (
        <SignedOut>
            <SignInButton>
                <Button size="sm">Sign In</Button>
            </SignInButton>
        </SignedOut>
    );
}
