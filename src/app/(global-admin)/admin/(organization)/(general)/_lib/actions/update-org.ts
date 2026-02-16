"use server";

import { ROLES } from "@/constants/global";
import { Organization } from "@/dto/organizations";
import { requireRole } from "@/lib/auth/require-role";
import { nameof } from "@/lib/utils";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = {
    isError: boolean;
    message: string;
};

export async function updateOrganization(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    await requireRole(ROLES.admin);

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

    if (!orgId) {
        return { isError: true, message: "Organization ID is required" };
    }

    if (!name) {
        return { isError: true, message: "Name cannot be empty" };
    }

    const featureFlags: Record<string, boolean> = {};
    for (const [key] of formData.entries()) {
        if (key.startsWith("feature.")) {
            // If checkbox is checked, it sends "on" (which overrides hidden "off")
            // If checkbox is unchecked, only hidden input sends "off"
            // Use getAll to check all values - if "on" is present, flag is true
            const allValues = formData.getAll(key);
            featureFlags[key] = allValues.includes("on");
        }
    }

    let headerImageUrl: string | null | undefined = undefined;
    const removeHeaderImage = formData.get("removeHeaderImage") === "on";
    const headerImageFile = formData.get("headerImage") as File | null;

    if (removeHeaderImage) {
        headerImageUrl = null;
    } else if (headerImageFile && headerImageFile.size > 0) {
        try {
            const blob = await put(
                `org-headers/${orgId}/${headerImageFile.name}`,
                headerImageFile,
                { access: "public" }
            );
            headerImageUrl = blob.url;
        } catch (err) {
            return {
                isError: true,
                message:
                    err instanceof Error
                        ? err.message
                        : "Failed to upload header image",
            };
        }
    }

    let profileIconUrl: string | null | undefined = undefined;
    const removeProfileIcon = formData.get("removeProfileIcon") === "on";
    const profileIconFile = formData.get("profileIcon") as File | null;

    if (removeProfileIcon) {
        profileIconUrl = null;
    } else if (profileIconFile && profileIconFile.size > 0) {
        try {
            const blob = await put(
                `org-profile-icons/${orgId}/${profileIconFile.name}`,
                profileIconFile,
                { access: "public" }
            );
            profileIconUrl = blob.url;
        } catch (err) {
            return {
                isError: true,
                message:
                    err instanceof Error
                        ? err.message
                        : "Failed to upload profile icon",
            };
        }
    }

    let slug = null;

    try {
        slug = await organizationAdminService.updateOrganization({
            orgId,
            name,
            motorsportregOrgId,
            description,
            ...(headerImageUrl !== undefined && { headerImageUrl }),
            ...(profileIconUrl !== undefined && { profileIconUrl }),
            isPublic,
            featureFlags:
                Object.keys(featureFlags).length > 0 ? featureFlags : undefined,
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

    const tab = formData.get("tab")?.toString();
    const params = new URLSearchParams();
    if (tab && tab !== "general") {
        params.set("tab", tab);
    }
    params.set("saved", "true");
    const queryString = params.toString();

    revalidatePath("/admin");
    redirect(`/admin/?${queryString}`);
}
