import { db, events } from "@/db";
import type { CreateEventDTO, EventDTO, UpdateEventDTO } from "@/dto/events";
import { generateSlug } from "@/lib/generate-slug";
import { eq, and } from "drizzle-orm";

interface IOrgEventsRepository {
    listByOrgId(orgId: string): Promise<EventDTO[]>;
    listByOrgIdAndSeasonId(
        seasonId: string,
        orgId: string
    ): Promise<EventDTO[]>;
    findById(eventId: string): Promise<EventDTO | null>;
    create(dto: CreateEventDTO): Promise<EventDTO>;
    update(
        eventId: string,
        orgId: string,
        dto: UpdateEventDTO
    ): Promise<EventDTO>;
    delete(eventId: string, orgId: string): Promise<boolean>;
}

export class OrgEventsRepository implements IOrgEventsRepository {
    async listByOrgId(orgId: string): Promise<EventDTO[]> {
        const rows = await db.query.events.findMany({
            where: { orgId, deletedAt: { isNull: true } },
            orderBy: (events, { asc }) => [asc(events.startAt)],
        });
        return rows;
    }

    async listByOrgIdAndSeasonId(
        seasonId: string,
        orgId: string
    ): Promise<EventDTO[]> {
        const rows = await db.query.events.findMany({
            where: { orgId, seasonId, deletedAt: { isNull: true } },
            orderBy: (events, { asc }) => [asc(events.startAt)],
        });
        return rows;
    }

    async findById(eventId: string): Promise<EventDTO | null> {
        const row = await db.query.events.findFirst({
            where: {
                eventId,
                deletedAt: { isNull: true },
            },
        });
        return row ?? null;
    }

    async create(dto: CreateEventDTO): Promise<EventDTO> {
        const [row] = await db
            .insert(events)
            .values({
                orgId: dto.orgId,
                seasonId: dto.seasonId,
                name: dto.name,
                slug: generateSlug(dto.name),
                startAt: dto.startAt,
                endAt: dto.endAt,
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
                startAt: dto.startAt,
                endAt: dto.endAt,
                updatedAt: new Date(),
            })
            .where(and(eq(events.eventId, eventId), eq(events.orgId, orgId)))
            .returning();

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

export const orgEventsRepository = new OrgEventsRepository();
