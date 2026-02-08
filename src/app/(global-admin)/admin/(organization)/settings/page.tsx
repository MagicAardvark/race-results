import { SettingsTab } from "@/app/(global-admin)/admin/_lib/components/organizations/settings/settings-tab";
import { ManagementTabs } from "@/app/(global-admin)/admin/_lib/components/organizations/tabs/management-tabs";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

export default async function OrganizationSettingsPage() {
    const user = await getCurrentUserCached();

    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return null;
    }

    const org = await organizationAdminService.findBySlug(storedTenant);

    if (org === null) {
        return null;
    }

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(
        org.orgId
    );

    return (
        <>
            <ManagementTabs roles={user?.roles || []} />
            <SettingsTab org={org} featureFlags={featureFlags} />
        </>
    );
}
