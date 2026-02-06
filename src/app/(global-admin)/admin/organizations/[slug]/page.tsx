import { GeneralTab } from "@/app/(global-admin)/admin/organizations/_lib/components/general-tab";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationGeneralPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const org = await organizationAdminService.findBySlug(slug);

    if (org === null) {
        return null;
    }

    return <GeneralTab org={org} />;
}
