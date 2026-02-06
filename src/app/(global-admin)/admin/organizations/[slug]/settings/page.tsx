import { SettingsTab } from "@/app/(global-admin)/admin/organizations/_lib/components/settings-tab";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationSettingsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const org = await organizationAdminService.findBySlug(slug);

    if (org === null) {
        return null;
    }

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(
        org.orgId
    );

    return <SettingsTab org={org} featureFlags={featureFlags} />;
}
