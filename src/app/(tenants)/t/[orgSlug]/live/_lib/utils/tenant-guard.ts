import { tenantService } from "@/services/tenants/tenant.service";
import { redirect } from "next/navigation";

/**
 * Validates tenant and redirects if invalid
 * Use this in page components to ensure proper tenant context
 */
export async function requireValidTenant() {
    const tenant = await tenantService.getTenant();

    if (!tenant.isValid || tenant.isGlobal) {
        redirect("/");
    }

    return tenant;
}

