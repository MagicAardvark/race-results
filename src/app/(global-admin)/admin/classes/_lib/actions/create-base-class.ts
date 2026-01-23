"use server";

import { newBaseClassSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { ROLES } from "@/constants/global";
import { BaseCarClass } from "@/dto/classes-admin";
import { requireRole } from "@/lib/auth/require-role";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createBaseClass(
    data: z.infer<typeof newBaseClassSchema>
): Promise<FormResponse<BaseCarClass>> {
    await requireRole(ROLES.admin);

    const result = await newBaseClassSchema.safeParseAsync(data);

    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message),
        };
    }

    const shortName = data.shortName.trim();
    const longName = data.longName.trim();

    let newBaseClass = null;

    try {
        newBaseClass = await classesAdminService.createGlobalBaseClass({
            shortName,
            longName,
        });
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    revalidatePath("/admin/classes");

    return {
        isError: false,
        message: "Base class created successfully",
        data: newBaseClass,
    };
}
