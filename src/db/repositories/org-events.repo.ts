import { db } from "@/db";
import type { EventDTO } from "@/dto/events";

interface IOrgEventsRepository {
    listByOrgId(orgId: string): Promise<EventDTO[]>;
    listByOrgIdAndSeasonId(
        seasonId: string,
        orgId: string
    ): Promise<EventDTO[]>;
    findById(eventId: string): Promise<EventDTO | null>;
}

export class OrgEventsRepository implements IOrgEventsRepository {
    async listByOrgId(orgId: string): Promise<EventDTO[]> {
        const rows = await db.query.events.findMany({
            where: { orgId, deletedAt: { isNull: true } },
            orderBy: (events, { asc }) => [asc(events.startDate)],
        });
        return rows;
    }

    async listByOrgIdAndSeasonId(
        seasonId: string,
        orgId: string
    ): Promise<EventDTO[]> {
        const rows = await db.query.events.findMany({
            where: { orgId, seasonId, deletedAt: { isNull: true } },
            orderBy: (events, { asc }) => [asc(events.startDate)],
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
}

export const orgEventsRepository = new OrgEventsRepository();
