import { ApiKeyManagement } from "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/components/api-key-management";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function ApiKeysPage() {
    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    return (
        <div className="space-y-4">
            <ApiKeyManagement org={org} />
        </div>
    );
}
