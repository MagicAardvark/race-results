"use server";

import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { eventsService } from "@/services/events/events.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function unlinkEvent(
    orgId: string,
    eventId: string
): Promise<FormResponse> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    if (!eventId) {
        return {
            isError: true,
            errors: "Event ID is required",
        };
    }

    try {
        await eventsService.unlinkEventFromMsrEvent(orgId, eventId);
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "An error occurred while unlinking the event",
        };
    }

    revalidatePath("/admin/");

    return {
        isError: false,
        message: "Event unlinked successfully",
    };
}
