"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/ui/button";
import { useLiveData } from "../../_lib/hooks/useLiveData";
import { linkDriverToCurrentUser } from "@/app/actions/user-profile";
import { MyStats } from "../../_lib/components/my-stats/my-stats";
import { DriverLinkForm } from "../../_lib/components/driver-link-form";
import { DriverLinkWarning } from "../../_lib/components/driver-link-warning";
import { DriverLinkEmptyState } from "../../_lib/components/driver-link-empty-state";
import { CollapsibleCallout } from "@/ui/collapsible-callout";
import type { UserWithExtendedDetails } from "@/dto/users";

/** Must match useDriverSelection STORAGE_KEY so MyStats shows the linked driver */
const SELECTED_DRIVER_STORAGE_KEY = "selected-driver-id";

type MePageClientProps = {
    user: UserWithExtendedDetails | null;
};

/**
 * Client UI for the Live Me page: sign-in prompt, driver link flow, or MyStats.
 * When the user is signed in but not linked, they pick their name from the event
 * driver list; on submit we call linkDriverToCurrentUser.
 * For reusable link logic elsewhere, use linkDriverToCurrentUser from
 * @/app/actions/user-profile with DriverLinkForm.
 */
export function MePageClient({ user }: MePageClientProps) {
    const router = useRouter();
    const [linking, setLinking] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(
        null
    );

    const allDrivers = useLiveData().getAllDrivers();
    const selectedDriver = selectedDriverId
        ? (allDrivers.find((d) => d.id === selectedDriverId) ?? null)
        : null;

    const isLinked = Boolean(
        user?.motorsportregId?.trim() || user?.driverLinkedAt
    );
    const needsMsrSync = isLinked && !user?.motorsportregId?.trim();

    const handleLinkDriver = async () => {
        if (!selectedDriver) return;
        setLinkError(null);
        setLinking(true);
        const result = await linkDriverToCurrentUser(
            selectedDriver.msrId,
            selectedDriver.name
        );
        setLinking(false);
        if (result.ok) {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(
                    SELECTED_DRIVER_STORAGE_KEY,
                    selectedDriver.id
                );
            }
            router.refresh();
        } else {
            setLinkError(result.message);
        }
    };

    const clearError = () => setLinkError(null);

    // Not signed in: prompt to sign in with Clerk
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">
                    Sign in to view your personal stats and link your driver
                    profile.
                </p>
                <SignInButton mode="modal">
                    <Button size="lg">Sign in with Clerk</Button>
                </SignInButton>
            </div>
        );
    }

    // Signed in but not linked yet: show driver picker
    if (!isLinked) {
        return (
            <div className="space-y-6">
                <DriverLinkWarning />
                {allDrivers.length === 0 ? (
                    <DriverLinkEmptyState />
                ) : (
                    <DriverLinkForm
                        drivers={allDrivers}
                        selectedDriverId={selectedDriverId}
                        onSelect={(id) => {
                            setSelectedDriverId(id);
                            clearError();
                        }}
                        onLink={handleLinkDriver}
                        linking={linking}
                        error={linkError}
                        selectLabel="I am this driver"
                        selectId="me-driver-select"
                        submitLabel="This is me"
                    />
                )}
            </div>
        );
    }

    // Linked: show MyStats; if no motorsportregId, show callout + Retry at top
    return (
        <div className="space-y-6">
            {needsMsrSync && (
                <CollapsibleCallout title="Unable to sync your account with MotorsportReg">
                    <DriverLinkForm
                        drivers={allDrivers}
                        selectedDriverId={selectedDriverId}
                        onSelect={(id) => {
                            setSelectedDriverId(id);
                            clearError();
                        }}
                        onLink={handleLinkDriver}
                        linking={linking}
                        error={linkError}
                        selectLabel="Select your name and retry"
                        selectId="retry-driver-select"
                        submitLabel="Retry"
                        submitLabelLoading="Retrying…"
                    />
                </CollapsibleCallout>
            )}
            <MyStats />
        </div>
    );
}
