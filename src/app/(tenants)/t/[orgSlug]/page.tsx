import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { MAIN_SITE_URL } from "@/constants/global";
import { tenantService } from "@/services/tenants/tenant.service";
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { CgMediaLive as LiveIcon } from "react-icons/cg";
import { LIVE_TIMING_LABEL } from "@/app/components/shared/live-timing";
import type { Event as MotorsportRegEvent } from "@/dto/motorsportreg";
import { getDateString } from "./_lib/utils/date-utils";
import { mergeOrgAndMrEvents } from "./_lib/events/merge-events";
import { EventsSection } from "./_lib/components/events-section";
import { EventList } from "./_lib/components/event-list";
import { ClientTenantLink } from "@/app/(tenants)/t/_lib/components/client-tenant-link";
import { getTenantBasePath } from "@/app/(tenants)/t/_lib/utils/get-tenant-base-path";
import { seasonsService } from "@/services/events/seasons.service";

export default async function Page() {
    const org = await tenantService.getTenant();
    const basePath = await getTenantBasePath();
    const currentSeason = (
        await seasonsService.getSeasonsForOrg(org.orgId)
    ).filter((season) => season.isCurrent)[0];

    const [orgEvents, events] = await Promise.all([
        orgEventsRepository.listByOrgIdAndSeasonId(
            currentSeason.seasonId,
            org.orgId
        ),
        org.motorsportregOrgId
            ? motorsportRegService
                  .getOrganizationCalendar(org.motorsportregOrgId, {
                      exclude_cancelled: true,
                  })
                  .then((r) => r.response.events)
                  .catch((err) => {
                      console.error(
                          "Failed to fetch MotorsportReg events:",
                          err
                      );
                      return [] as MotorsportRegEvent[];
                  })
            : Promise.resolve([] as MotorsportRegEvent[]),
    ]);

    const today = getDateString(new Date());
    const { upcoming, past } = mergeOrgAndMrEvents(orgEvents, events, today);

    return (
        <div className="container mx-auto px-4 py-8">
            <header
                className="mb-6 flex items-center justify-between"
                role="banner"
            >
                <Button variant="ghost" size="sm" asChild>
                    <Link href={MAIN_SITE_URL}>
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Organizations
                    </Link>
                </Button>
                <Button size="lg" asChild>
                    <ClientTenantLink
                        pathFromTenantRoot="/live"
                        tenantBase={basePath}
                    >
                        <LiveIcon className="mr-2 h-5 w-5 animate-pulse text-white" />
                        {LIVE_TIMING_LABEL}
                    </ClientTenantLink>
                </Button>
            </header>

            <main className="contents">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {org.name}
                    </h1>
                    {org.description ? (
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {org.description}
                        </p>
                    ) : org.motorsportregOrgId ? (
                        <p className="text-muted-foreground mt-2">
                            View upcoming events and results for this
                            organization
                        </p>
                    ) : null}
                </div>

                <EventsSection
                    id="upcoming-events"
                    title="Upcoming Events"
                    variant="primary"
                    emptyMessage="No upcoming events scheduled. Check back soon."
                    hasItems={upcoming.length > 0}
                />
                {upcoming.length > 0 && (
                    <div className="mt-6 sm:mt-8">
                        <EventList items={upcoming} variant="upcoming" />
                    </div>
                )}

                {past.length > 0 && (
                    <>
                        <EventsSection
                            id="past-events"
                            title="Past Events"
                            variant="muted"
                            hasItems
                        />
                        <div className="mt-6 sm:mt-8">
                            <EventList items={past} variant="past" />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
