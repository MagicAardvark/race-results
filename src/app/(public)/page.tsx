import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { organizationService } from "@/services/organizations/organization.service";
import { getDateString } from "@/lib/date-utils";
import type { NextEvent } from "@/app/(public)/_lib/components/org-card";
import { LandingHero } from "@/app/(public)/_lib/components/landing-hero";
import { OrganizationsSection } from "@/app/(public)/_lib/components/organizations-section";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();
    const orgEventsByOrg = await Promise.all(
        orgs.map((org) => orgEventsRepository.listByOrgId(org.orgId))
    );

    const today = getDateString(new Date());
    const upcomingCountByOrgId = orgs.reduce<Record<string, number>>(
        (acc, org, i) => {
            const events = orgEventsByOrg[i] ?? [];
            acc[org.orgId] = events.filter(
                (e) => getDateString(e.endDate) >= today
            ).length;
            return acc;
        },
        {}
    );

    const nextEventByOrgId = orgs.reduce<Record<string, NextEvent | null>>(
        (acc, org, i) => {
            const events = (orgEventsByOrg[i] ?? [])
                .filter((e) => getDateString(e.endDate) >= today)
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                );
            acc[org.orgId] =
                events.length > 0
                    ? {
                          name: events[0]!.name,
                          startDate: new Date(events[0]!.startDate),
                          endDate: new Date(events[0]!.endDate),
                      }
                    : null;
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
