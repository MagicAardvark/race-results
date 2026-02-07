"use server";

import { ROLES } from "@/constants/global";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { requireRole } from "@/lib/auth/require-role";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function deleteEvent(
    eventId: string,
    orgId: string,
    slug: string
): Promise<FormResponse> {
    await requireRole(ROLES.admin);

    if (!eventId || !orgId) {
        return {
            isError: true,
            errors: "Event and organization are required",
        };
    }

    try {
        const deleted = await orgEventsRepository.delete(eventId, orgId);
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

    revalidatePath(`/admin/organizations/${slug}`);
    revalidatePath("/admin/organizations");
    return { isError: false, message: "Event deleted" };
}
