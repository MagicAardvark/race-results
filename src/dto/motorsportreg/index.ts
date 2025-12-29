/**
 * MotorsportReg API DTOs
 * Based on https://api.motorsportreg.com/
 */

export interface MotorsportRegResponse<T> {
    response: T;
}

export interface Event {
    id: string;
    name: string;
    type: string;
    start: string;
    end: string;
    detailuri: string;
    venue: Venue;
    registration?: {
        start?: string;
        end?: string;
    };
}

export interface Venue {
    id: string;
    name: string;
    city: string;
    region: string;
    country?: string;
    postalcode?: string;
}

export interface CalendarResponse {
    events: Event[];
}

export interface EventDetail extends Event {
    description?: string;
    status?: string;
    capacity?: number;
    registered?: number;
}

export interface Attendee {
    id: string;
    name: string;
    email?: string;
    status: string;
    registered?: string;
    lastupdate?: string;
    order?: {
        total?: number;
        currency?: string;
    };
    questions?: Record<string, unknown>;
    packages?: unknown[];
}

export interface AttendeesResponse {
    attendees: Attendee[];
}

export interface Assignment {
    id: string;
    attendee_id: string;
    segment_id?: string;
    class_id?: string;
    number?: string;
    position?: number;
}

export interface AssignmentsResponse {
    assignments: Assignment[];
}

export interface Checkin {
    id?: string;
    attendee_id: string;
    event_id: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserProfile {
    id: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
}

export interface OrganizationMembership {
    id: string;
    name: string;
    role?: string;
    [key: string]: unknown;
}

export interface Vehicle {
    id: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    number?: string;
    [key: string]: unknown;
}

export interface OrganizationCalendarParams {
    postalcode?: string;
    radius?: number;
    country?: string;
    archive?: boolean;
    start?: string; // YYYY-MM-DD
    end?: string; // YYYY-MM-DD
    exclude_cancelled?: boolean;
    types?: string; // comma-delimited type_ids
}

export interface AuthenticatedCalendarParams extends OrganizationCalendarParams {
    registered_since?: string; // UTC timestamp
    lastupdate_since?: string; // UTC timestamp
    precise_timestamps?: boolean;
    fields?: "questions" | "packages" | "questions,packages";
}

