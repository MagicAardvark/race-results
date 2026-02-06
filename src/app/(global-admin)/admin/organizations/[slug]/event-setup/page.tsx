import { EventSetupTab } from "@/app/(global-admin)/admin/organizations/_lib/components/event-setup-tab";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationEventSetupPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const org = await organizationAdminService.findBySlug(slug);

    if (org === null) {
        return null;
    }

    const [classGroups, availableBaseClasses] = await Promise.all([
        classGroupsService.getClassGroupsForOrg(org.orgId),
        classGroupsService.getAvailableBaseClasses(org.orgId),
    ]);

    return (
        <EventSetupTab
            orgId={org.orgId}
            initialClassGroups={classGroups}
            availableBaseClasses={availableBaseClasses}
        />
    );
}
