"use server";

import { ROLES } from "@/constants/global";
import { Organization } from "@/dto/organizations";
import { requireRole } from "@/lib/auth/require-role";
import { nameof } from "@/lib/utils";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SimpleActionState } from "@/types/forms";
import {
    ORG_IMAGE_FIELDS,
    processImageField,
} from "../process-org-image-fields";

export async function updateOrganization(
    _: SimpleActionState,
    formData: FormData
): Promise<SimpleActionState> {
    await requireRole(ROLES.admin);

    const orgId = formData.get(nameof<Organization>("orgId"))?.toString();
    const orgSlug = formData.get("slug")?.toString().trim();
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
    if (!orgSlug) {
        return { isError: true, message: "Organization slug is required" };
    }
    if (!name) {
        return { isError: true, message: "Name cannot be empty" };
    }

    const featureFlags: Record<string, boolean> = {};
    for (const [key] of formData.entries()) {
        if (key.startsWith("feature.")) {
            featureFlags[key] = formData.getAll(key).includes("on");
        }
    }

    const [headerResult, profileResult] = await Promise.all(
        ORG_IMAGE_FIELDS.map((config) =>
            processImageField(formData, orgSlug, config)
        )
    );
    if (!headerResult.ok) return headerResult.error;
    if (!profileResult.ok) return profileResult.error;

    const headerImageUrl = headerResult.url;
    const profileIconUrl = profileResult.url;

    let slug: string | null = null;
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

    const params = new URLSearchParams();
    params.set("saved", "true");
    const tab = formData.get("tab")?.toString();
    if (tab && tab !== "general") {
        params.set("tab", tab);
    }

    revalidatePath("/admin");
    redirect(`/admin/?${params.toString()}`);
}
