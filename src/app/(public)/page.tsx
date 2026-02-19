import { organizationService } from "@/services/organizations/organization.service";
import { getDateString } from "@/lib/date-utils";
import type { NextEvent } from "@/app/(public)/_lib/components/org-card";
import { LandingHero } from "@/app/(public)/_lib/components/landing-hero";
import { OrganizationsSection } from "@/app/(public)/_lib/components/organizations-section";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();
    const orgEvents = (
        await Promise.all(
            orgs.map(async (org) => ({
                slug: org.slug,
                events: await publicCalendarService.getPublicCalendar(org.slug),
                org,
            }))
        )
    ).map((details) => {
        const next = details.events.upcoming[0];
        return {
            org: details.org,
            upcomingCount: details.events.upcoming.length,
            nextEvent: next
                ? {
                      name: next.name,
                      startDate: new Date(next.startDate),
                      endDate: new Date(next.endDate),
                  }
                : null,
        };
    });

    const today = getDateString(new Date());
    const upcomingCountByOrgId = orgEvents.reduce<Record<string, number>>(
        (acc, { org, upcomingCount }) => {
            acc[org.orgId] = upcomingCount;
            return acc;
        },
        {}
    );
    const nextEventByOrgId = orgEvents.reduce<Record<string, NextEvent | null>>(
        (acc, { org, nextEvent }) => {
            acc[org.orgId] = nextEvent;
            return acc;
        },
        {}
    );

    return (
        <div className="flex flex-col">
            <LandingHero />
            <OrganizationsSection
                orgs={orgs}
                upcomingCountByOrgId={upcomingCountByOrgId}
                nextEventByOrgId={nextEventByOrgId}
                today={today}
            />
        </div>
    );
}
