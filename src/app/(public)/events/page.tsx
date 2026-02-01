import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { organizationService } from "@/services/organizations/organization.service";
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import { getDateString } from "@/app/(tenants)/t/[orgSlug]/_lib/utils/date-utils";
import { EventsSection } from "@/app/(tenants)/t/[orgSlug]/_lib/components/events-section";
import { EventList } from "@/app/(tenants)/t/[orgSlug]/_lib/components/event-list";
import { mergeAllClubsEvents } from "./_lib/all-clubs-events";

export default async function EventsPage() {
    const orgs = await organizationService.getAllOrganizations();
    const orgsWithMrId = orgs.filter(
        (o): o is typeof o & { motorsportregOrgId: string } =>
            Boolean(o.motorsportregOrgId)
    );

    const [orgsWithOrgEvents, orgsWithMrEvents] = await Promise.all([
        Promise.all(
            orgs.map(async (org) => ({
                org,
                orgEvents: await orgEventsRepository.listByOrgId(org.orgId),
            }))
        ),
        Promise.all(
            orgsWithMrId.map(async (org) => {
                const events = await motorsportRegService
                    .getOrganizationCalendar(org.motorsportregOrgId, {
                        exclude_cancelled: true,
                    })
                    .then((r) => r.response.events)
                    .catch((err) => {
                        console.error(
                            `MotorsportReg calendar for ${org.slug}:`,
                            err
                        );
                        return [];
                    });
                return { org, events };
            })
        ),
    ]);

    const today = getDateString(new Date());
    const { upcoming, past } = mergeAllClubsEvents(
        orgsWithOrgEvents,
        orgsWithMrEvents,
        today
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold sm:text-4xl">Events</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Upcoming and past events from all clubs—from our calendar
                    and MotorsportReg.
                </p>
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
        </div>
    );
}
