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
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { TriangleAlert } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import { GeneralTab } from "@/app/(global-admin)/admin/organizations/_lib/components/general-tab";
import { EventSetupTab } from "@/app/(global-admin)/admin/organizations/_lib/components/event-setup-tab";
import { SettingsTab } from "@/app/(global-admin)/admin/organizations/_lib/components/settings-tab";

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

    const featureFlags = await featureFlagsService.getOrgFeatureFlags(
        org.orgId
    );

    const [classGroups, availableBaseClasses] = await Promise.all([
        classGroupsService.getClassGroupsForOrg(org.orgId),
        classGroupsService.getAvailableBaseClasses(org.orgId),
    ]);

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{org.name}</h1>
                <LinkButton href="/admin/organizations">Go Back</LinkButton>
            </div>
            <Tabs defaultValue="general" className="w-full">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="event-setup">Event Setup</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <GeneralTab org={org} />
                </TabsContent>
                <TabsContent value="event-setup">
                    <EventSetupTab
                        orgId={org.orgId}
                        initialClassGroups={classGroups}
                        availableBaseClasses={availableBaseClasses}
                    />
                </TabsContent>
                <TabsContent value="settings">
                    <SettingsTab org={org} featureFlags={featureFlags} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
