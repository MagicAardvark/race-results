"use client";

import { useOrganizationData } from "@/app/(global-admin)/admin/organizations/[slug]/_lib/organization-data-context";
import { EventSetupTab } from "@/app/(global-admin)/admin/organizations/_lib/components/event-setup-tab";

export default function OrganizationEventSetupPage() {
    const { org, classGroups, availableBaseClasses } = useOrganizationData();

    return (
        <EventSetupTab
            orgId={org.orgId}
            initialClassGroups={classGroups}
            availableBaseClasses={availableBaseClasses}
        />
    );
}
