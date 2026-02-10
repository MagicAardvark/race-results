"use server";

import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { eventsService } from "@/services/events/events.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function updateEventLink(
    orgId: string,
    eventId: string,
    msrEventId: string
): Promise<FormResponse> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    if (!eventId) {
        return {
            isError: true,
            errors: "Event ID is required",
        };
    }

    if (!msrEventId) {
        return {
            isError: true,
            errors: "MSR Event ID is required",
        };
    }

    try {
        await eventsService.linkEventToMsrEvent(orgId, eventId, msrEventId);
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "An error occurred while linking the event",
        };
    }

    revalidatePath("/admin/");

    return {
        isError: false,
        message: "Event link updated successfully",
    };
}
