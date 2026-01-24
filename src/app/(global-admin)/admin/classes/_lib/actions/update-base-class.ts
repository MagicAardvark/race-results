"use server";

import { updateBaseClassSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { ROLES } from "@/constants/global";
import { BaseCarClass } from "@/dto/classes-admin";
import { requireRole } from "@/lib/auth/require-role";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function updateBaseClass(
    classId: string,
    data: z.infer<typeof updateBaseClassSchema>
): Promise<FormResponse<BaseCarClass>> {
    await requireRole(ROLES.admin);

    const result = await updateBaseClassSchema.safeParseAsync(data);

    if (!result.success) {
        return {
            isError: true,
            errors: result.error.issues.map((err) => err.message),
        };
    }

    const shortName = data.shortName.trim();
    const longName = data.longName.trim();
    const classTypeKey =
        !data.classTypeKey ||
        data.classTypeKey === "" ||
        data.classTypeKey === "Invalid"
            ? null
            : data.classTypeKey.trim();
    const classCategoryId =
        !data.classCategoryId ||
        data.classCategoryId === "" ||
        data.classCategoryId === "Invalid"
            ? null
            : data.classCategoryId.trim();
    const isEnabled = data.isEnabled;

    let updatedBaseClass = null;

    try {
        updatedBaseClass = await classesAdminService.updateGlobalBaseClass({
            classId: classId,
            shortName,
            longName,
            classTypeKey,
            classCategoryId,
            isEnabled,
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
        message: "Base class updated successfully",
        data: updatedBaseClass,
    };
}
