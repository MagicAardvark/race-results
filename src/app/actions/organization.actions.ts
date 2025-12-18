"use server";

import { organizationService } from "@/services/organizations/organization.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = {
    isError: boolean;
    message: string;
};

export async function upsertOrganization(
    _: ActionState,
    formData: FormData
): Promise<ActionState | never> {
    const name = formData.get("org-name")?.toString().trim();
    const id = formData.get("org-id")?.toString();

    if (!name) {
        return { isError: true, message: "Name cannot be empty" };
    }

    let org = null;

    try {
        if (id) {
            org = await organizationService.updateOrganization({
                orgId: id,
                name,
            });
        } else {
            org = await organizationService.createOrganization({ name });
        }
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    if (org === null) {
        return {
            isError: true,
            message: "Organization could not be found after save",
        };
    }

    revalidatePath("/admin/organizations/");
    redirect(`/admin/organizations/${org.slug}`);
}
