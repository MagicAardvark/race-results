import { FeatureFlagsManagement } from "@/app/(global-admin)/admin/(organization)/settings/_lib/feature-flags/components/feature-flags-management";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function FeatureFlagsPage() {
    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(org.orgId);

    return (
        <div className="space-y-4">
            <FeatureFlagsManagement org={org} featureFlags={featureFlags} />
        </div>
    );
}
