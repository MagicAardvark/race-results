"use server";

import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { refresh } from "next/cache";

export async function generateApiKey(
    orgId: string,
    options: {
        isEnabled: boolean;
    }
) {
    await requireRole(ROLES.admin);

    await organizationAdminService.createApiKey(orgId, options.isEnabled);

    refresh();
}
