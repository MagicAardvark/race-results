"use server";

import { baseEventSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema";
import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { eventsService } from "@/services/events/events.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import z from "zod";

export async function createEvent(
    orgId: string,
    seasonId: string,
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
        await eventsService.createEvent({
            orgId: orgId,
            seasonId: seasonId,
            name: data.name,
            isMultiDay: data.isMultiDay,
            startAt: data.startDate,
            endAt: data.endDate,
            msrEventId: data.isLinkedToMsrEvent ? data.msrEventId : undefined,
        });
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "Failed to create event",
        };
    }

    revalidatePath("/admin/");

    return { isError: false, message: `${data.name} created` };
}
