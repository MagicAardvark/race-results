import { GeneralTab } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/components/general-tab";
import { ManagementTabs } from "@/app/(global-admin)/admin/_lib/components/organizations/tabs/management-tabs";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

export default async function Page() {
    const user = await getCurrentUserCached();

    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return null;
    }

    // Todo: Ensure user has access to this tenant, otherwise throw an error or redirect.
    const org = await organizationAdminService.findBySlug(storedTenant);

    if (!org) {
        return null;
    }

    return (
        <>
            <ManagementTabs roles={user?.roles || []} />
            <GeneralTab org={org} />
        </>
    );
}
