import { eventsRepository } from "@/db/repositories/results/events.repo";
import {
    CreateEventData,
    EventConfiguration,
    EventDetail,
    EventDTO,
    UpdateEventData,
} from "@/dto/events";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

interface IEventsService {
    getEventConfiguration(): Promise<EventConfiguration>;
    getEvents(orgId: string, seasonSlug: string): Promise<EventDetail[]>;
    getEvent(eventId: string, orgId: string): Promise<EventDetail | null>;
    getCurrentEvent(orgId: string): Promise<EventDetail | null>;
    createEvent(event: CreateEventData): Promise<EventDetail>;
    updateEvent(event: UpdateEventData): Promise<EventDetail>;
    deleteEvent(orgId: string, eventId: string): Promise<boolean>;
    linkEventToMsrEvent(
        orgId: string,
        eventId: string,
        msrEventId: string
    ): Promise<void>;
    unlinkEventFromMsrEvent(orgId: string, eventId: string): Promise<void>;
}

export class EventsService implements IEventsService {
    async getEventConfiguration(): Promise<EventConfiguration> {
        // Placeholder until events database is implemented
        return Promise.resolve({
            scoringMode: "singlebest",
            conePenaltyInSeconds: 2,
            trophyConfiguration: {
                mode: "percentage",
                value: 33,
            },
        });
    }

    async getEvents(orgId: string, seasonId: string): Promise<EventDetail[]> {
        const events = await eventsRepository.getEvents(orgId, seasonId);

        return this.mapEvents(events);
    }

    async getCurrentEvent(orgId: string): Promise<EventDetail | null> {
        const event = await eventsRepository.getCurrentEvent(orgId);
        return event ? this.mapEvent(event) : null;
    }

    async getEvent(
        orgId: string,
        eventId: string
    ): Promise<EventDetail | null> {
        const event = await eventsRepository.getEvent(orgId, eventId);
        return event ? this.mapEvent(event) : null;
    }

    async createEvent(event: CreateEventData): Promise<EventDetail> {
        const eventEndDate =
            event.isMultiDay && event.endDate ? event.endDate : event.startDate;

        const created = await eventsRepository.create({
            orgId: event.orgId,
            seasonId: event.seasonId,
            name: event.name,
            startDate: event.startDate,
            endDate: eventEndDate,
            msrEventId: event.msrEventId,
        });

        await publicCalendarService.updateCacheForOrg(event.orgId);

        return this.mapEvent(created);
    }

    async updateEvent(event: UpdateEventData): Promise<EventDetail> {
        const eventEndDate =
            event.isMultiDay && event.endDate ? event.endDate : event.startDate;

        const updated = await eventsRepository.update(
            event.eventId,
            event.orgId,
            {
                name: event.name,
                startDate: event.startDate,
                endDate: eventEndDate,
            }
        );

        await publicCalendarService.updateCacheForOrg(event.orgId);

        return this.mapEvent(updated);
    }

    async deleteEvent(eventId: string, orgId: string): Promise<boolean> {
        const result = await eventsRepository.delete(eventId, orgId);

        if (result) {
            await publicCalendarService.updateCacheForOrg(orgId);
        }

        return result;
    }

    async linkEventToMsrEvent(
        orgId: string,
        eventId: string,
        msrEventId: string
    ): Promise<void> {
        await eventsRepository.linkToMsrEvent(orgId, eventId, msrEventId);
        await publicCalendarService.updateCacheForOrg(orgId);
    }

    async unlinkEventFromMsrEvent(
        orgId: string,
        eventId: string
    ): Promise<void> {
        await eventsRepository.linkToMsrEvent(orgId, eventId, null);
        await publicCalendarService.updateCacheForOrg(orgId);
    }

    private mapEvents(events: EventDTO[]): EventDetail[] {
        return events.map((event) => this.mapEvent(event));
    }

    private mapEvent(event: EventDTO): EventDetail {
        return {
            ...event,
            isMultiDay: event.startDate !== event.endDate,
        };
    }
}

export const eventsService = new EventsService();
