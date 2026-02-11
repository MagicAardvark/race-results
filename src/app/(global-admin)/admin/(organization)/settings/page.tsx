import { ApiKeyManagement } from "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/components/api-key-management";
import { FeatureFlagsManagement } from "@/app/(global-admin)/admin/(organization)/settings/_lib/feature-flags/components/feature-flags-management";
import { ManagementTabs } from "@/app/(global-admin)/admin/_lib/components/organizations/tabs/management-tabs";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationSettingsPage() {
    const { currentOrg, currentRoles } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(
        org.orgId
    );

    return (
        <>
            <ManagementTabs roles={currentRoles} />
            <div className="space-y-4">
                <ApiKeyManagement org={org} />
                <FeatureFlagsManagement org={org} featureFlags={featureFlags} />
            </div>
        </>
    );
}
