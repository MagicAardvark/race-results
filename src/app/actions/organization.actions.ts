"use server";

import { ROLES } from "@/constants/global";
import { Organization } from "@/dto/organizations";
import { nameof } from "@/lib/utils";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { userService } from "@/services/users/user.service";
import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = {
    isError: boolean;
    message: string;
};

export async function createOrganization(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    const name = formData.get(nameof<Organization>("name"))?.toString().trim();

    if (!name) {
        return { isError: true, message: "Name cannot be empty" };
    }

    let slug = null;

    try {
        slug = await organizationAdminService.createOrganization({ name });
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    if (slug === null) {
        return {
            isError: true,
            message: "Organization could not be found after save",
        };
    }

    revalidatePath("/admin/organizations/");
    redirect(`/admin/organizations/${slug}`);
}

export async function updateOrganization(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    const orgId = formData.get(nameof<Organization>("orgId"))?.toString();
    const name = formData.get(nameof<Organization>("name"))?.toString().trim();
    const motorsportregOrgId =
        formData
            .get(nameof<Organization>("motorsportregOrgId"))
            ?.toString()
            .trim() || null;
    const description =
        formData.get(nameof<Organization>("description"))?.toString().trim() ||
        null;
    const isPublic = formData.get(nameof<Organization>("isPublic")) === "on";

    // Feature flags
    const paxEnabled = formData.get("feature.liveTiming.paxEnabled") === "on";
    const workRunEnabled =
        formData.get("feature.liveTiming.workRunEnabled") === "on";

    if (!orgId) {
        return { isError: true, message: "Organization ID is required" };
    }

    if (!name) {
        return { isError: true, message: "Name cannot be empty" };
    }

    let slug = null;

    // Verify user has admin permissions
    const user = await userService.getCurrentUser();
    if (!user?.roles.includes(ROLES.admin)) {
        throw new Error("Unauthorized: Admin access required");
    }

    try {
        slug = await organizationAdminService.updateOrganization({
            orgId,
            name,
            motorsportregOrgId,
            description,
            isPublic,
            featureFlags: {
                "feature.liveTiming.paxEnabled": paxEnabled,
                "feature.liveTiming.workRunEnabled": workRunEnabled,
            },
        });
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    if (slug === null) {
        return {
            isError: true,
            message: "Organization could not be found after save",
        };
    }

    revalidatePath("/admin/organizations/");
    redirect(`/admin/organizations/${slug}`);
}

export async function updateApiKey(
    orgId: string,
    options: {
        isEnabled: boolean;
    }
) {
    // Verify user has admin permissions
    const user = await userService.getCurrentUser();
    if (!user?.roles.includes(ROLES.admin)) {
        throw new Error("Unauthorized: Admin access required");
    }

    await organizationAdminService.createApiKey(orgId, options.isEnabled);

    refresh();
}
