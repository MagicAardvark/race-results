import { CalendarEvent } from "@/dto/calendar";

interface IPublicCalendarService {
    getPublicCalendar(orgId: string): Promise<CalendarEvent[]>;
}

export class PublicCalendarService implements IPublicCalendarService {
    getPublicCalendar(_orgId: string): Promise<CalendarEvent[]> {
        // Placeholder until calendar database is implemented
        return Promise.resolve([]);
    }
}

export const publicCalendarService = new PublicCalendarService();
