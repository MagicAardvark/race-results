import { db } from "@/db";
import { StoredMsrEventDTO } from "@/dto/motorsportreg/stored";

interface IMsrEventsRepository {
    getEvents(orgId: string): Promise<StoredMsrEventDTO[]>;
}

export class MsrEventsRepository implements IMsrEventsRepository {
    async getEvents(orgId: string): Promise<StoredMsrEventDTO[]> {
        if (!orgId) {
            throw new Error("orgId is required");
        }

        return db.query.msrEvents.findMany({
            with: {
                venue: true,
            },
            where: {
                orgId: orgId,
            },
        });
    }
}

export const msrEventsRepository = new MsrEventsRepository();
