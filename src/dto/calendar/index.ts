export interface CalendarEvent {
    eventId: string;
    org: {
        orgId: string;
        name: string;
        slug: string;
    };
    slug: string;
    name: string;
    description: string | null;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    msrEventLink: string | null;
    location: string | null;
}
