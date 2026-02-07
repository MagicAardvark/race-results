import { db } from "@/db";
import { EventDTO } from "@/dto/events";

interface IEventsRepository {
    getEvent(orgId: string, eventId: string): Promise<EventDTO>;
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
                orgId,
                eventId,
                deletedAt: { isNull: true },
            },
        });

        if (!event) {
            throw new Error("Event not found");
        }

        return event;
    }
}
