import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import {
    CreateEventData,
    EventConfiguration,
    EventDTO,
    UpdateEventData,
} from "@/dto/events";

interface IEventsService {
    getEventConfiguration(): Promise<EventConfiguration>;
    createEvent(event: CreateEventData): Promise<EventDTO>;
    updateEvent(event: UpdateEventData): Promise<EventDTO>;
    deleteEvent(eventId: string, orgId: string): Promise<void>;
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
}

export const eventsService = new EventsService();
