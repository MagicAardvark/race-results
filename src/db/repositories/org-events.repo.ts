import { db } from "@/db";
import type {
    CreateOrgEventDTO,
    OrgEventDTO,
    UpdateOrgEventDTO,
} from "@/dto/org-events";
import { orgEvents } from "@/db/tables/orgs";
import { eq, and } from "drizzle-orm";

interface IOrgEventsRepository {
    listByOrgId(orgId: string): Promise<OrgEventDTO[]>;
    findById(eventId: string): Promise<OrgEventDTO | null>;
    create(dto: CreateOrgEventDTO): Promise<OrgEventDTO>;
    update(
        eventId: string,
        orgId: string,
        dto: UpdateOrgEventDTO
    ): Promise<OrgEventDTO | null>;
    delete(eventId: string, orgId: string): Promise<boolean>;
}

export class OrgEventsRepository implements IOrgEventsRepository {
    async listByOrgId(orgId: string): Promise<OrgEventDTO[]> {
        const rows = await db.query.orgEvents.findMany({
            where: { orgId },
            orderBy: (events, { asc }) => [asc(events.startAt)],
        });
        return rows;
    }

    async findById(eventId: string): Promise<OrgEventDTO | null> {
        const row = await db.query.orgEvents.findFirst({
            where: { eventId },
        });
        return row ?? null;
    }

    async create(dto: CreateOrgEventDTO): Promise<OrgEventDTO> {
        const [row] = await db
            .insert(orgEvents)
            .values({
                orgId: dto.orgId,
                name: dto.name,
                startAt: dto.startAt,
                endAt: dto.endAt,
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
        dto: UpdateOrgEventDTO
    ): Promise<OrgEventDTO | null> {
        const [row] = await db
            .update(orgEvents)
            .set({
                name: dto.name,
                startAt: dto.startAt,
                endAt: dto.endAt,
                updatedAt: new Date(),
            })
            .where(
                and(eq(orgEvents.eventId, eventId), eq(orgEvents.orgId, orgId))
            )
            .returning();
        return row ?? null;
    }

    async delete(eventId: string, orgId: string): Promise<boolean> {
        const result = await db
            .delete(orgEvents)
            .where(
                and(eq(orgEvents.eventId, eventId), eq(orgEvents.orgId, orgId))
            );
        return (result.rowCount ?? 0) > 0;
    }
}

export const orgEventsRepository = new OrgEventsRepository();
