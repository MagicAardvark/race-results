import { EventConfiguration } from "@/dto/events";

interface IEventsService {
    getEventConfiguration(): Promise<EventConfiguration>;
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
}

export const eventsService = new EventsService();
