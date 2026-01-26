"use server";

import { addIndexValueSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createIndexValue(
    classId: string,
    data: z.infer<typeof addIndexValueSchema>
): Promise<FormResponse> {
    await requireRole(ROLES.admin);

    const result = await addIndexValueSchema.safeParseAsync(data);

    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message).join(", "),
        };
    }

    try {
        await classesAdminService.createIndexValue(
            classId,
            data.indexValue,
            data.year
        );
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
        message: "Index value created successfully",
    };
}
