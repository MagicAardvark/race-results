import { GeneralTab } from "@/app/(global-admin)/admin/_lib/components/organizations/general/general-tab";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page() {
    const storedTenant = await getStoredTenant();

    // Todo: Ensure user has access to this tenant, otherwise throw an error or redirect.
    const org = await organizationAdminService.findBySlug(storedTenant);

    if (!org) {
        return null;
    }

    return <GeneralTab org={org} />;
}
