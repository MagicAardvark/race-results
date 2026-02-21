"use server";

/**
 * Shared actions for updating the current user's profile (e.g. linking to an
 * event driver). Use linkDriverToCurrentUser from settings, Me page, or any
 * flow where the user selects their driver/identity; pair with DriverLinkForm
 * for the UI.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { userService } from "@/services/users/user.service";
import { revalidatePath } from "next/cache";

/**
 * Parses a full driver name into first and last name.
 * First token is firstName; remainder is lastName (handles "First Middle Last").
 */
function parseDriverName(driverName: string): {
    firstName: string;
    lastName: string;
} {
    const trimmed = driverName.trim();
    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1) {
        return { firstName: trimmed, lastName: "" };
    }
    return {
        firstName: trimmed.slice(0, firstSpace),
        lastName: trimmed.slice(firstSpace + 1).trim(),
    };
}

/**
 * Formats display name as "FirstName L" (first initial of last name).
 * @example formatDisplayName("Dan", "Johns") => "Dan J"
 */
function formatDisplayName(firstName: string, lastName: string): string {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!last) return first;
    return `${first} ${last[0]}`.trim();
}

/** Result of linking the current user to a driver profile. */
export type LinkDriverToCurrentUserResult =
    | { ok: true }
    | { ok: false; message: string };

/**
 * Links the currently authenticated user to an event driver by updating their
 * profile with the driver's MotorsportReg id and name. Email is read from Clerk
 * (currentUser.primaryEmailAddress). Sets driverLinkedAt so the app knows the
 * user has completed the link step even when msrId is empty.
 *
 * Use this from the Me page, settings, or any flow where the user selects
 * their driver/identity from event results.
 *
 * @param msrId - MotorsportReg id from the selected driver (can be empty)
 * @param driverName - Full name from event results (e.g. "First Last")
 * @returns Result indicating success or an error message
 */
export async function linkDriverToCurrentUser(
    msrId: string,
    driverName: string
): Promise<LinkDriverToCurrentUserResult> {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
        return {
            ok: false,
            message: "You must be signed in to link your driver.",
        };
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress?.trim() || null;

    const user = await userService.getCurrentUser();
    if (!user) {
        return {
            ok: false,
            message: "User record not found. Please sign in again.",
        };
    }

    const { firstName, lastName } = parseDriverName(driverName);
    const displayName = formatDisplayName(firstName, lastName) || undefined;

    await userService.updateUser(user.userId, {
        motorsportregId: msrId.trim() || null,
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        displayName,
        driverLinkedAt: new Date(),
    });

    revalidatePath("/", "layout");
    return { ok: true };
}
