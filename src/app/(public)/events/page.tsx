import { EventsSection } from "@/app/(tenants)/t/[orgSlug]/_lib/components/events-section";
import { EventList } from "@/app/(tenants)/t/[orgSlug]/_lib/components/event-list";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

export default async function EventsPage() {
    const { past, upcoming } =
        await publicCalendarService.getPublicCalendar("all");

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold sm:text-4xl">Events</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Upcoming and past events from all clubs.
                </p>
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
                    <EventList
                        items={upcoming}
                        variant="upcoming"
                        displayMode="combined"
                    />
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
                        <EventList
                            items={past}
                            variant="past"
                            displayMode="combined"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
