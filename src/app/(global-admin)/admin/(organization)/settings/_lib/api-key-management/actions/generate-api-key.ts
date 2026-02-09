"use server";

import { ROLES } from "@/constants/global";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { refresh } from "next/cache";

export async function generateApiKey(
    orgId: string,
    options: {
        isEnabled: boolean;
    }
) {
    await requireOrgRole(orgId, ROLES.orgOwner);

    await organizationAdminService.createApiKey(orgId, options.isEnabled);

    refresh();
}
