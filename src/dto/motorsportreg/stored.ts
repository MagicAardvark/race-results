export interface StoredMsrEventDTO {
    msrEventId: string;
    orgId: string;
    name: string;
    description?: string | null;
    image?: string | null;
    type: string;
    start: string;
    end: string;
    registrationStartDate?: string | null;
    registrationStartTime?: string | null;
    registrationEndDate?: string | null;
    registrationEndTime?: string | null;
    detailUri: string;
    venueId: string;
}

export interface StoredMsrEventVenueDTO {
    msrEventVenueId: string;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    postalCode?: string | null;
    lat?: string | null;
    lng?: string | null;
}
