import { db, events } from "@/db";
import { CreateEventDTO, EventDTO, UpdateEventDTO } from "@/dto/events";
import { generateSlug } from "@/lib/generate-slug";
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
    create(dto: CreateEventDTO): Promise<EventDTO>;
    update(
        eventId: string,
        orgId: string,
        dto: UpdateEventDTO
    ): Promise<EventDTO>;
    delete(eventId: string, orgId: string): Promise<boolean>;
}

export class EventsRepository implements IEventsRepository {
    async getEvents(orgId: string, seasonId: string): Promise<EventDTO[]> {
        if (!orgId || !seasonId) {
            throw new Error("orgId and seasonId are required");
        }

        const rows = await db.query.events.findMany({
            with: {
                msrEvent: true,
            },
            where: { orgId, seasonId, deletedAt: { isNull: true } },
            orderBy: (events, { asc }) => [asc(events.startDate)],
        });

        return rows;
    }

    async getEvent(orgId: string, eventId: string): Promise<EventDTO> {
        const event = await db.query.events.findFirst({
            with: {
                season: true,
                segments: true,
                entries: false,
                msrEvent: true,
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
                startDate: { lte: new Date().toISOString().split("T")[0] },
                endDate: { gte: new Date().toISOString().split("T")[0] },
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

    async create(dto: CreateEventDTO): Promise<EventDTO> {
        const [row] = await db
            .insert(events)
            .values({
                orgId: dto.orgId,
                seasonId: dto.seasonId,
                name: dto.name,
                slug: generateSlug(dto.name),
                startDate: dto.startDate,
                startTime: "00:00:00",
                endDate: dto.endDate,
                endTime: "23:59:59",
                timezone: "America/New_York",
                msrEventId: dto.msrEventId ?? null,
            })
            .returning();

        if (!row) {
            throw new Error("Failed to create org event");
        }

        return row;
    }

    async update(
        eventId: string,
        orgId: string,
        dto: UpdateEventDTO
    ): Promise<EventDTO> {
        const [row] = await db
            .update(events)
            .set({
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                updatedAt: new Date(),
            })
            .where(and(eq(events.eventId, eventId), eq(events.orgId, orgId)))
            .returning();

        if (!row) {
            throw new Error("Failed to update org event");
        }
        return row;
    }

    async delete(eventId: string, orgId: string): Promise<boolean> {
        const result = await db
            .update(events)
            .set({ deletedAt: new Date() })
            .where(and(eq(events.eventId, eventId), eq(events.orgId, orgId)));

        return (result.rowCount ?? 0) > 0;
    }
}

export const eventsRepository = new EventsRepository();
