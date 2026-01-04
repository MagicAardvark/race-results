import { ApiKeyManagement } from "@/app/(global-admin)/admin/components/organizations/api-key-management/api-key-management";
import { UpdateOrgForm } from "@/app/(global-admin)/admin/components/organizations/update-org-form";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/ui/empty";
import { LinkButton } from "@/ui/link-button";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { TriangleAlert } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const org = await organizationAdminService.findBySlug(slug);

    if (org === null) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <TriangleAlert />
                    </EmptyMedia>
                    <EmptyTitle>Organization Not Found</EmptyTitle>
                    <EmptyDescription>
                        The organization you are looking for does not exist.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <LinkButton href="/admin/organizations">Go Back</LinkButton>
                </EmptyContent>
            </Empty>
        );
    }

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(org.orgId);

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{org.name}</h1>
                <LinkButton href="/admin/organizations">Go Back</LinkButton>
            </div>
            <UpdateOrgForm org={org} featureFlags={featureFlags} />
            <ApiKeyManagement org={org} />
        </div>
    );
}
