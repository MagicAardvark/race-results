import { db, eventEntries, eventRuns } from "@/db";
import {
    EventCloseoutDTO,
    EventEntryInsertDTO,
    EventRunInsertDTO,
} from "@/dto/results/event-closeout";
import { eq } from "drizzle-orm";

interface IEventCloseoutRepository {
    storeEventData(dto: EventCloseoutDTO): Promise<void>;
}

export class EventCloseoutRepository implements IEventCloseoutRepository {
    async storeEventData(dto: EventCloseoutDTO): Promise<void> {
        const entries: EventEntryInsertDTO[] = [];
        const runs: EventRunInsertDTO[] = [];

        for (const entry of dto.results) {
            const eventEntryId = crypto.randomUUID();

            entries.push({
                entryId: eventEntryId,
                eventId: dto.eventId,
                classId: entry.classId,
                classGroupId: entry.classGroupId,
                carNumber: entry.carNumber,
                driverName: entry.driverName,
                slug: entry.slug,
                carModel: entry.carModel,
                sponsor: entry.sponsor,
                externalAccountId: entry.externalAccountId,
            });

            for (const run of entry.runs) {
                runs.push({
                    entryId: eventEntryId,
                    segmentId: run.segmentId,
                    runNumber: run.runNumber,
                    status: run.status,
                    timeMs: run.timeMs,
                    penaltyCount: run.penaltyCount,
                });
            }
        }

        await db
            .delete(eventEntries)
            .where(eq(eventEntries.eventId, dto.eventId));

        await db.insert(eventEntries).values(entries);

        await db.insert(eventRuns).values(runs);
    }
}

export const eventCloseoutRepository = new EventCloseoutRepository();
