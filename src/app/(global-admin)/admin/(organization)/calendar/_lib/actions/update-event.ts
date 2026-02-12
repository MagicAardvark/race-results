"use server";

import { baseEventSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema";
import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { eventsService } from "@/services/events/events.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import z from "zod";

export async function updateEvent(
    orgId: string,
    eventId: string,
    data: z.infer<typeof baseEventSchema>
): Promise<FormResponse> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    const {
        success,
        data: event,
        error,
    } = await baseEventSchema.safeParseAsync(data);

    if (!success) {
        return {
            isError: true,
            errors: error.issues.map((err) => err.message),
        };
    }

    if (event.isMultiDay && event.endDate < event.startDate) {
        return {
            isError: true,
            errors: "End date must be on or after start date",
        };
    }

    try {
        const updated = await eventsService.updateEvent({
            eventId: eventId,
            orgId: orgId,
            name: event.name,
            isMultiDay: event.isMultiDay,
            startDate: event.startDate,
            endDate: event.endDate,
        });
        if (!updated) {
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
                    : "Failed to update event",
        };
    }

    revalidatePath("/admin");

    return { isError: false, message: "Event updated" };
}
