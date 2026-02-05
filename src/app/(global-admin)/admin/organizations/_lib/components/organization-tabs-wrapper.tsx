"use client";

import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import { GeneralTab } from "./general-tab";
import { EventSetupTab } from "./event-setup-tab";
import { SettingsTab } from "./settings-tab";
import { CalendarTab } from "./calendar/calendar-tab";
import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "./class-groups/_lib/types";
import { EventDTO } from "@/dto/events";

type OrganizationTabsWrapperProps = {
    org: OrganizationExtended;
    featureFlags: OrgFeatureFlags;
    classGroups: ClassGroupWithClasses[];
    availableBaseClasses: AvailableBaseClass[];
    orgEvents: EventDTO[];
    currentTab: string;
};

export const OrganizationTabsWrapper = ({
    org,
    featureFlags,
    classGroups,
    availableBaseClasses,
    orgEvents,
    currentTab,
}: OrganizationTabsWrapperProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams();
        if (value !== "general") {
            params.set("tab", value);
        }
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl);
    };

    return (
        <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="event-setup">Event Setup</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
            <TabsContent value="calendar">
                <CalendarTab
                    orgId={org.orgId}
                    orgSlug={org.slug}
                    events={orgEvents}
                />
            </TabsContent>
            <TabsContent value="settings">
                <SettingsTab org={org} featureFlags={featureFlags} />
            </TabsContent>
        </Tabs>
    );
};
