"use server";

import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { eventsService } from "@/services/events/events.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function deleteEvent(
    eventId: string,
    orgId: string
): Promise<FormResponse> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    if (!eventId || !orgId) {
        return {
            isError: true,
            errors: "Event and organization are required",
        };
    }

    try {
        const deleted = await eventsService.deleteEvent(eventId, orgId);
        if (!deleted) {
            return {
                isError: true,
                errors: "Event not found or access denied",
            };
        }
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "Failed to delete event",
        };
    }

    revalidatePath("/admin");

    return { isError: false, message: "Event deleted" };
}
