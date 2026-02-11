import { ClassGroupsManagement } from "@/app/(global-admin)/admin/(organization)/event-setup/_lib/components/class-groups-management";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationEventSetupPage() {
    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    const [classGroups, availableBaseClasses] = await Promise.all([
        classGroupsService.getClassGroupsForOrg(org.orgId),
        classGroupsService.getAvailableBaseClasses(org.orgId),
    ]);

    return (
        <div className="space-y-4">
            <ClassGroupsManagement
                orgId={org.orgId}
                initialClassGroups={classGroups}
                availableBaseClasses={availableBaseClasses}
            />
        </div>
    );
}
