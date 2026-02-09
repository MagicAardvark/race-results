"use server";

import { createSeasonSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema/seasons";
import { ROLES } from "@/constants/global";
import { Season } from "@/dto/events/seasons";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { seasonsService } from "@/services/events/seasons.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import z from "zod";

export async function createSeason(
    orgId: string,
    data: z.infer<typeof createSeasonSchema>
): Promise<FormResponse<Season>> {
    await requireOrgRole(orgId, ROLES.orgOwner);

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

        revalidatePath(`/admin`);

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
