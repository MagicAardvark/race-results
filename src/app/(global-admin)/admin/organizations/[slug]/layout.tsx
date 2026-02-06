import { LinkButton } from "@/ui/link-button";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
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

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{org.name}</h1>
                <LinkButton href="/admin/organizations">Go Back</LinkButton>
            </div>
            <OrganizationTabsNav orgSlug={org.slug} />
            {children}
        </div>
    );
}
