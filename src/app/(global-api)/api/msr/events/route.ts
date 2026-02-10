import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { ROLES } from "@/constants/global";
import { hasAnyOrgRole } from "@/lib/auth/has-org-role";
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import { organizationService } from "@/services/organizations/organization.service";

export async function GET() {
    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return new Response("Unauthorized", { status: 401 });
    }

    const hasRole = await hasAnyOrgRole(storedTenant, [
        ROLES.orgManager,
        ROLES.orgOwner,
    ]);

    if (!hasRole) {
        return new Response("Unauthorized", { status: 401 });
    }

    const org = await organizationService.getOrganizationBySlug(storedTenant);

    if (!org || !org.motorsportregOrgId) {
        return new Response("Organization not found", { status: 404 });
    }

    const events = await motorsportRegService
        .getOrganizationCalendar(org.motorsportregOrgId)
        .then((r) => r.response.events);

    if (!events) {
        return new Response("No events found", { status: 404 });
    }

    return new Response(JSON.stringify(events), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
