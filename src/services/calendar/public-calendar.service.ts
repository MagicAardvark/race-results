import { CalendarEvent } from "@/dto/calendar";
import { Organization } from "@/dto/organizations";
import { appCache } from "@/lib/cache/app-cache";
import { eventsService } from "@/services/events/events.service";
import { seasonsService } from "@/services/events/seasons.service";
import { organizationService } from "@/services/organizations/organization.service";

interface IPublicCalendarService {
    getPublicCalendar(orgSlug: string): Promise<{
        past: CalendarEvent[];
        upcoming: CalendarEvent[];
    }>;
    updateCacheForOrgBySlug(orgSlug: string): Promise<void>;
    updateCacheForOrg(orgId: string): Promise<void>;
    getCacheKey(orgSlug: string): string;
}

export class PublicCalendarService implements IPublicCalendarService {
    async getPublicCalendar(orgSlug: string): Promise<{
        past: CalendarEvent[];
        upcoming: CalendarEvent[];
    }> {
        const cached = await appCache.get<{
            past: CalendarEvent[];
            upcoming: CalendarEvent[];
        }>(this.getCacheKey(orgSlug));

        return cached || { past: [], upcoming: [] };
    }

    async updateCacheForAllOrgs(): Promise<void> {
        const orgs = await organizationService.getAllOrganizations();

        const events = await Promise.all(
            orgs.map((org) => this.buildCalendarEventsForOrg(org))
        );

        await Promise.all(
            events.map(([shouldUpdate, orgEvents], index) => {
                if (shouldUpdate) {
                    return this.updateCache(orgs[index].slug, orgEvents);
                }
                return Promise.resolve();
            })
        );

        const combinedEvents = events
            .reduce<CalendarEvent[]>((acc, [shouldUpdate, orgEvents]) => {
                if (shouldUpdate) {
                    return [...acc, ...orgEvents];
                }
                return acc;
            }, [])
            .sort((a, b) => {
                const dateA = new Date(a.startDate);
                const dateB = new Date(b.startDate);
                return dateA.getTime() - dateB.getTime();
            });

        this.updateCache("all", combinedEvents);
    }

    async updateCacheForOrgBySlug(orgSlug: string): Promise<void> {
        const org = await organizationService.getOrganizationBySlug(orgSlug);

        if (!org) {
            return;
        }

        const [shouldUpdate, events] =
            await this.buildCalendarEventsForOrg(org);

        if (!shouldUpdate) {
            return;
        }

        return this.updateCache(org?.slug, events);
    }

    async updateCacheForOrg(orgId: string): Promise<void> {
        const org = await organizationService.getOrganization(orgId);

        if (!org) {
            return;
        }

        const [shouldUpdate, events] =
            await this.buildCalendarEventsForOrg(org);

        if (!shouldUpdate) {
            return;
        }

        return this.updateCache(org?.slug, events);
    }

    private async updateCache(orgSlug: string, events: CalendarEvent[]) {
        const today = new Date();
        const past = events.filter((e) => new Date(e.endDate) < today);
        const upcoming = events.filter((e) => new Date(e.endDate) >= today);

        await appCache.set(
            this.getCacheKey(orgSlug),
            JSON.stringify({ past, upcoming })
        );
    }

    private async buildCalendarEventsForOrg(
        org: Organization
    ): Promise<[boolean, CalendarEvent[]]> {
        const orgId = org.orgId;

        let shouldUpdate = true;
        let calendarEvents: CalendarEvent[] = [];

        try {
            const seasons = await seasonsService.getSeasonsForOrg(orgId);
            const events = await eventsService.getEvents(
                orgId,
                seasons[0].seasonId
            );

            calendarEvents = events.map((event) => ({
                eventId: event.eventId,
                org: {
                    orgId: org.orgId,
                    name: org.name,
                    slug: org.slug,
                },
                slug: event.slug,
                name: event.name,
                description: event.msrEvent?.description ?? null,
                startDate: event.startDate,
                startTime: event.startTime,
                endDate: event.endDate,
                endTime: event.endTime,
                msrEventLink: event.msrEvent?.detailUri ?? null,
                location: event.msrEvent?.venue
                    ? `${event.msrEvent.venue.city}, ${event.msrEvent.venue.region}`
                    : "TBD",
            }));
        } catch {
            // TODO: Log the error somewhere
            shouldUpdate = false;
        }

        return [shouldUpdate, calendarEvents];
    }

    getCacheKey(orgSlug: string): string {
        return `publicCalendar:${orgSlug}`;
    }
}

export const publicCalendarService = new PublicCalendarService();
