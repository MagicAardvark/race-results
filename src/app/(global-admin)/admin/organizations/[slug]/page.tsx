import { UpdateOrgForm } from "@/components/admin/organizations/update-org-form";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/library/ui/empty";
import { LinkButton } from "@/components/link-button/link-button";
import { organizationService } from "@/services/organizations/organization.service";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { TriangleAlert } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const org = await organizationService.getOrganizationBySlug(slug);

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
        <div>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <LinkButton href="/admin/organizations">Go Back</LinkButton>
                </div>
                <UpdateOrgForm org={org} featureFlags={featureFlags} />
            </div>
        </div>
    );
}
