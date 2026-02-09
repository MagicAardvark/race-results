import { ClassGroupsManagement } from "@/app/(global-admin)/admin/(organization)/event-setup/_lib/components/class-groups-management";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationEventSetupPage() {
    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return null;
    }

    const org = await organizationAdminService.findBySlug(storedTenant);

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
