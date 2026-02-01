import Link from "next/link";
import { redirect } from "next/navigation";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { tenantService } from "@/services/tenants/tenant.service";
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import { Button } from "@/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { CgMediaLive as LiveIcon } from "react-icons/cg";
import type { Event as MotorsportRegEvent } from "@/dto/motorsportreg";
import { getDateString } from "./_lib/utils/date-utils";
import { mergeOrgAndMrEvents } from "./_lib/events/merge-events";
import { EventsSection } from "./_lib/components/events-section";
import { EventList } from "./_lib/components/event-list";

export default async function Page() {
    const tenant = await tenantService.getTenant();

    if (!tenant.isValid) {
        redirect("/");
    }

    const [orgEvents, events] = await Promise.all([
        orgEventsRepository.listByOrgId(tenant.org.orgId),
        tenant.org.motorsportregOrgId
            ? motorsportRegService
                  .getOrganizationCalendar(tenant.org.motorsportregOrgId, {
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
                    <Link href="/">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Organizations
                    </Link>
                </Button>
                <Button size="lg" asChild>
                    <Link href={`/t/${tenant.org.slug}/live`}>
                        <LiveIcon className="mr-2 h-5 w-5 animate-pulse text-white" />
                        Live Timing
                    </Link>
                </Button>
            </header>

            <main className="contents">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {tenant.org.name}
                    </h1>
                    {tenant.org.description ? (
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {tenant.org.description}
                        </p>
                    ) : tenant.org.motorsportregOrgId ? (
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
                >
                    <EventList items={upcoming} variant="upcoming" />
                </EventsSection>

                {past.length > 0 && (
                    <EventsSection
                        id="past-events"
                        title="Past Events"
                        variant="muted"
                        hasItems
                    >
                        <EventList items={past} variant="past" />
                    </EventsSection>
                )}
            </main>
        </div>
    );
}
