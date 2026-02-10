import { db, events } from "@/db";
import { EventDTO } from "@/dto/events";
import { and, eq } from "drizzle-orm";

interface IEventsRepository {
    getEvent(orgId: string, eventId: string): Promise<EventDTO>;
    getCurrentEvent(orgId: string): Promise<EventDTO | null>;
    getCurrentEventId(orgId: string): Promise<string | null>;
    linkToMsrEvent(
        orgId: string,
        eventId: string,
        msrEventId: string | null
    ): Promise<void>;
}

export class EventsRepository implements IEventsRepository {
    async getEvent(orgId: string, eventId: string): Promise<EventDTO> {
        const event = await db.query.events.findFirst({
            with: {
                season: true,
                segments: true,
                entries: false,
            },
            where: {
                orgId: { eq: orgId },
                eventId: { eq: eventId },
                deletedAt: { isNull: true },
            },
        });

        if (!event) {
            throw new Error("Event not found");
        }

        return event;
    }

    async getCurrentEvent(orgId: string): Promise<EventDTO | null> {
        const currentEvent = await db.query.events.findFirst({
            where: {
                orgId: { eq: orgId },
                startAt: { lte: new Date() },
                endAt: { gte: new Date() },
                deletedAt: { isNull: true },
            },
        });

        if (!currentEvent) {
            return null;
        }

        return currentEvent;
    }

    async getCurrentEventId(orgId: string): Promise<string | null> {
        const currentEvent = await this.getCurrentEvent(orgId);

        return currentEvent ? currentEvent.eventId : null;
    }

    async linkToMsrEvent(
        orgId: string,
        eventId: string,
        msrEventId: string | null
    ): Promise<void> {
        await db
            .update(events)
            .set({
                msrEventId: msrEventId,
            })
            .where(and(eq(events.eventId, eventId), eq(events.orgId, orgId)));
    }
}

export const eventsRepository = new EventsRepository();
