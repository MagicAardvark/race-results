"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/**
 * Renders Clerk's UserButton only after client mount to avoid hydration mismatch.
 * Server and first client paint show a same-size placeholder so layout is stable.
 *
 * @see https://clerk.com/docs/references/nextjs/user-button#user-button-client
 */
export function UserButtonClient() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Defer UserButton to client-only to avoid Clerk hydration mismatch; setState here is intentional.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- no React API to "has mounted" without this
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className="bg-muted size-8 shrink-0 rounded-full"
                aria-hidden
            />
        );
    }

    return <UserButton />;
}
