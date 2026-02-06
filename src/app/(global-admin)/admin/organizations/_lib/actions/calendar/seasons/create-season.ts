"use server";

import { createSeasonSchema } from "@/app/(global-admin)/admin/organizations/_lib/schema/calendar/seasons";
import { ROLES } from "@/constants/global";
import { Season } from "@/dto/events/seasons";
import { requireRole } from "@/lib/auth/require-role";
import { seasonsService } from "@/services/events/seasons.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import z from "zod";

export async function createSeason(
    orgId: string,
    orgSlug: string,
    data: z.infer<typeof createSeasonSchema>
): Promise<FormResponse<Season>> {
    await requireRole(ROLES.admin);

    const result = await createSeasonSchema.safeParseAsync(data);

    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message),
        };
    }

    try {
        const newSeason = await seasonsService.create({
            orgId: orgId,
            ...data,
        });

        revalidatePath(`/admin/organizations/${orgSlug}/calendar`);

        return {
            isError: false,
            message: `${data.name} created`,
            data: newSeason,
        };
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "Failed to create season",
        };
    }
}
