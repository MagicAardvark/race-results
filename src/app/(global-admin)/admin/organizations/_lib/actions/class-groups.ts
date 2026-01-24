"use server";

import {
    createClassGroupSchema,
    updateClassGroupSchema,
} from "@/app/(global-admin)/admin/organizations/_lib/schema/class-groups";
import { ROLES } from "@/constants/global";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";
import z from "zod";

/**
 * Filters out invalid class IDs (null, undefined, empty strings, non-UUIDs)
 */
function filterValidClassIds(
    classIds: (string | null | undefined)[]
): string[] {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return (classIds || []).filter((id): id is string => {
        return typeof id === "string" && id.length > 0 && uuidRegex.test(id);
    });
}

/**
 * Handles validation errors from Zod schema parsing
 */
function handleValidationError<T>(result: {
    success: boolean;
    error?: z.ZodError;
    data?: T;
}): FormResponse<T> | null {
    if (!result.success) {
        return {
            isError: true,
            errors:
                result.error?.issues.map((err: z.ZodIssue) => err.message) ||
                [],
        };
    }
    return null;
}

/**
 * Handles service errors and returns appropriate FormResponse
 */
function handleServiceError(error: unknown): FormResponse<never> {
    return {
        isError: true,
        errors:
            error instanceof Error
                ? [error.message]
                : ["An unknown error occurred"],
    };
}

/**
 * Revalidates the organizations admin path
 */
function revalidateOrganizationsPath() {
    revalidatePath("/admin/organizations", "layout");
}

export async function createClassGroup(
    orgId: string,
    data: z.infer<typeof createClassGroupSchema>
): Promise<FormResponse<ClassGroupWithClasses>> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    const result = await createClassGroupSchema.safeParseAsync(data);
    const validationError = handleValidationError(result);
    if (validationError)
        return validationError as FormResponse<ClassGroupWithClasses>;

    if (!result.success || !result.data) {
        return {
            isError: true,
            errors: ["Validation failed"],
        };
    }

    const { shortName, longName, classIds: rawClassIds } = result.data;
    const classIds = filterValidClassIds(rawClassIds || []);

    try {
        const newClassGroup = await classGroupsService.createClassGroup({
            shortName,
            longName,
            orgId,
            classIds,
        });

        revalidateOrganizationsPath();

        return {
            isError: false,
            message: "Class group created successfully",
            data: newClassGroup,
        };
    } catch (error) {
        return handleServiceError(error);
    }
}

export async function updateClassGroup(
    orgId: string,
    data: z.infer<typeof updateClassGroupSchema>
): Promise<FormResponse<ClassGroupWithClasses>> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    const result = await updateClassGroupSchema.safeParseAsync(data);
    const validationError = handleValidationError(result);
    if (validationError)
        return validationError as FormResponse<ClassGroupWithClasses>;

    if (!result.success || !result.data) {
        return {
            isError: true,
            errors: ["Validation failed"],
        };
    }

    const {
        classGroupId,
        shortName,
        longName,
        isEnabled,
        classIds: rawClassIds,
    } = result.data;
    const classIds = filterValidClassIds(rawClassIds || []);

    try {
        const updatedClassGroup = await classGroupsService.updateClassGroup({
            classGroupId,
            shortName,
            longName,
            isEnabled,
            classIds,
        });

        revalidateOrganizationsPath();

        return {
            isError: false,
            message: "Class group updated successfully",
            data: updatedClassGroup,
        };
    } catch (error) {
        return handleServiceError(error);
    }
}

export async function deleteClassGroup(
    orgId: string,
    classGroupId: string
): Promise<FormResponse<void>> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    try {
        await classGroupsService.deleteClassGroup(classGroupId, orgId);
        revalidateOrganizationsPath();

        return {
            isError: false,
            message: "Class group deleted successfully",
        };
    } catch (error) {
        return handleServiceError(error);
    }
}

export async function getClassGroup(
    orgId: string,
    classGroupId: string
): Promise<ClassGroupWithClasses | null> {
    await requireOrgRole(orgId, ROLES.orgOwner);

    return classGroupsService.getClassGroup(classGroupId, orgId);
}
