"use server";

import { updateIndexValueSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function updateIndexValue(
    indexValueId: string,
    indexValue: number
): Promise<FormResponse> {
    await requireRole(ROLES.admin);

    const result = await updateIndexValueSchema.safeParseAsync({
        indexValue,
    });

    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message),
        };
    }

    try {
        await classesAdminService.updateIndexValue(indexValueId, indexValue);
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
        message: "Index value updated successfully",
    };
}
