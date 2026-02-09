"use server";

import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { FormResponse } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function createOrganization(
    name: string
): Promise<FormResponse<{ slug: string }>> {
    await requireRole(ROLES.admin);

    if (!name) {
        return { isError: true, errors: "Name cannot be empty" };
    }

    let slug = null;

    try {
        slug = await organizationAdminService.createOrganization({ name });
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    if (slug === null) {
        return {
            isError: true,
            errors: "Organization could not be found after save",
        };
    }

    revalidatePath("/admin");

    return {
        isError: false,
        message: `${name} created`,
        data: { slug },
    };
}
