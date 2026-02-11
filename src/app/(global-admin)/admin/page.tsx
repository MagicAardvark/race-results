import { GeneralTab } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/components/general-tab";
import { ManagementTabs } from "@/app/(global-admin)/admin/_lib/components/organizations/tabs/management-tabs";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page() {
    const { currentOrg, currentRoles } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (!org) {
        return <div className="p-4">Organization not found.</div>;
    }

    return (
        <>
            <ManagementTabs roles={currentRoles} />
            <GeneralTab org={org} />
        </>
    );
}
