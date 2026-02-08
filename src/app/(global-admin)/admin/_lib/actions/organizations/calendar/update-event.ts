"use server";

import { baseEventSchema } from "@/app/(global-admin)/admin/_lib/schema/organizations/calendar";
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

    const result = await baseEventSchema.safeParseAsync(data);
    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message),
        };
    }

    if (data.endDate && data.endDate < data.startDate) {
        return {
            isError: true,
            errors: "End date must be on or after start date",
        };
    }

    try {
        const updated = await eventsService.updateEvent({
            eventId: eventId,
            orgId: orgId,
            name: data.name,
            startAt: data.startDate,
            endAt: data.endDate ?? data.startDate,
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
