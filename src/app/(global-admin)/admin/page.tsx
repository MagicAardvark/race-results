import { OrganizationInformation } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/components/organization-information";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page() {
    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (!org) {
        return <div className="p-4">Organization not found.</div>;
    }

    return <OrganizationInformation org={org} />;
}
