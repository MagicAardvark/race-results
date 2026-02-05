"use client";

import { useOrganizationData } from "@/app/(global-admin)/admin/organizations/[slug]/_lib/organization-data-context";
import { CalendarTab } from "@/app/(global-admin)/admin/organizations/_lib/components/calendar/calendar-tab";

export default function OrganizationCalendarPage() {
    const { org, orgEvents } = useOrganizationData();

    return (
        <CalendarTab orgId={org.orgId} orgSlug={org.slug} events={orgEvents} />
    );
}
