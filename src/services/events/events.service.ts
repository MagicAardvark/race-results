import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { eventsRepository } from "@/db/repositories/results/events.repo";
import {
    CreateEventData,
    EventConfiguration,
    EventDTO,
    UpdateEventData,
} from "@/dto/events";

interface IEventsService {
    getEventConfiguration(): Promise<EventConfiguration>;
    getEvent(eventId: string, orgId: string): Promise<EventDTO | null>;
    getCurrentEvent(orgId: string): Promise<EventDTO | null>;
    createEvent(event: CreateEventData): Promise<EventDTO>;
    updateEvent(event: UpdateEventData): Promise<EventDTO>;
    deleteEvent(orgId: string, eventId: string): Promise<void>;
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

    async getCurrentEvent(orgId: string): Promise<EventDTO | null> {
        return await eventsRepository.getCurrentEvent(orgId);
    }

    async getEvent(orgId: string, eventId: string): Promise<EventDTO | null> {
        return await eventsRepository.getEvent(orgId, eventId);
    }

    async createEvent(event: CreateEventData): Promise<EventDTO> {
        const isSingleDay =
            !event.endAt || event.startAt.getTime() === event.endAt.getTime();

        const ensureStartOfStartDate = new Date(event.startAt);
        ensureStartOfStartDate.setHours(0, 0, 0, 0);

        const ensureEndOfEndDate = new Date(
            isSingleDay ? event.startAt : event.endAt!
        );
        ensureEndOfEndDate.setHours(23, 59, 59, 999);

        return await orgEventsRepository.create({
            orgId: event.orgId,
            seasonId: event.seasonId,
            name: event.name,
            startAt: ensureStartOfStartDate,
            endAt: ensureEndOfEndDate,
            msrEventId: event.msrEventId,
        });
    }

    async updateEvent(event: UpdateEventData): Promise<EventDTO> {
        const isSingleDay =
            !event.endAt || event.startAt.getTime() === event.endAt.getTime();

        const ensureStartOfStartDate = new Date(event.startAt);
        ensureStartOfStartDate.setHours(0, 0, 0, 0);

        const ensureEndOfEndDate = new Date(
            isSingleDay ? event.startAt : event.endAt!
        );
        ensureEndOfEndDate.setHours(23, 59, 59, 999);

        return await orgEventsRepository.update(event.eventId, event.orgId, {
            name: event.name,
            startAt: ensureStartOfStartDate,
            endAt: ensureEndOfEndDate,
        });
    }

    async deleteEvent(eventId: string, orgId: string): Promise<void> {
        await orgEventsRepository.delete(eventId, orgId);
    }

    async linkEventToMsrEvent(
        orgId: string,
        eventId: string,
        msrEventId: string
    ): Promise<void> {
        await eventsRepository.linkToMsrEvent(orgId, eventId, msrEventId);
    }

    async unlinkEventFromMsrEvent(
        orgId: string,
        eventId: string
    ): Promise<void> {
        await eventsRepository.linkToMsrEvent(orgId, eventId, null);
    }
}

export const eventsService = new EventsService();
