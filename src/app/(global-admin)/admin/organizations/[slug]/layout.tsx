import { LinkButton } from "@/ui/link-button";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { OrganizationDataProvider } from "./_lib/organization-data-context";
import { OrganizationTabsNav } from "./_lib/organization-tabs-nav";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/ui/empty";
import { TriangleAlert } from "lucide-react";

export default async function AdminOrganizationLayout({
    children,
    params,
}: {
    children: React.ReactNode;
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

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(
        org.orgId
    );

    const [classGroups, availableBaseClasses, orgEvents] = await Promise.all([
        classGroupsService.getClassGroupsForOrg(org.orgId),
        classGroupsService.getAvailableBaseClasses(org.orgId),
        orgEventsRepository.listByOrgId(org.orgId),
    ]);

    return (
        <OrganizationDataProvider
            data={{
                org,
                featureFlags,
                classGroups,
                availableBaseClasses,
                orgEvents,
            }}
        >
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{org.name}</h1>
                    <LinkButton href="/admin/organizations">Go Back</LinkButton>
                </div>
                <OrganizationTabsNav orgSlug={org.slug} />
                {children}
            </div>
        </OrganizationDataProvider>
    );
}
