import { ApiError } from "@/lib/errors/app-errors";
import {
    Assignment,
    AssignmentsResponse,
    AttendeesResponse,
    AuthenticatedCalendarParams,
    CalendarResponse,
    EventDetail,
    MotorsportRegResponse,
    OrganizationCalendarParams,
} from "@/dto/motorsportreg";

const API_BASE_URL = "https://api.motorsportreg.com";

export type ResponseFormat = "json" | "xml" | "jsonp" | "rss" | "atom" | "ics";

export interface MotorsportRegConfig {
    apiKey?: string;
    username?: string;
    password?: string;
    organizationId?: string;
    format?: ResponseFormat;
}

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

export class MotorsportRegService {
    private config: MotorsportRegConfig;

    constructor(config?: MotorsportRegConfig) {
        this.config = {
            apiKey:
                config?.apiKey ||
                process.env.MOTORSPORTREG_API_KEY,
            format: config?.format || "json",
            ...config,
        };
    }

    /**
     * Build URL with query parameters
     */
    private buildUrl(
        endpoint: string,
        params?: Record<string, string | number | boolean | undefined>
    ): string {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        url.pathname += `.${this.config.format || "json"}`;

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return url.toString();
    }

    /**
     * Get authentication headers
     */
    private getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            Accept: "application/vnd.pukkasoft+json",
        };

        // Basic auth with username/password
        if (this.config.username && this.config.password) {
            const credentials = Buffer.from(
                `${this.config.username}:${this.config.password}`
            ).toString("base64");
            headers.Authorization = `Basic ${credentials}`;
        }

        // Organization ID header (required for authenticated requests)
        if (this.config.organizationId) {
            headers["X-Organization-Id"] = this.config.organizationId;
        }

        return headers;
    }

    /**
     * Make HTTP request to MotorsportReg API
     */
    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { method = "GET", headers = {}, params, body } = options;

        const url = this.buildUrl(endpoint, params);
        const authHeaders = this.getAuthHeaders();

        const requestHeaders = {
            ...authHeaders,
            ...headers,
        };

        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
        };

        if (body) {
            requestOptions.body =
                typeof body === "string" ? body : JSON.stringify(body);
            if (!requestHeaders["Content-Type"]) {
                requestHeaders["Content-Type"] = "application/json";
            }
        }

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new ApiError(
                    `MotorsportReg API error: ${response.statusText}`,
                    response.status,
                    errorText
                );
            }

            // Handle different response formats
            if (this.config.format === "json" || this.config.format === "jsonp") {
                const data = await response.json();
                return data as T;
            }

            if (this.config.format === "xml") {
                const text = await response.text();
                // For XML, you might want to parse it here or return as string
                return text as T;
            }

            // For RSS, Atom, ICS, etc., return as text
            const text = await response.text();
            return text as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                `Failed to fetch from MotorsportReg API: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    /**
     * Get calendar of events for a single organization (unauthenticated)
     */
    async getOrganizationCalendar(
        organizationId: string,
        params?: OrganizationCalendarParams
    ): Promise<MotorsportRegResponse<CalendarResponse>> {
        return this.request<MotorsportRegResponse<CalendarResponse>>(
            `/rest/calendars/organization/${organizationId}`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get calendar for a single organization and event type (unauthenticated)
     */
    async getOrganizationCalendarByType(
        organizationId: string,
        typeId: string,
        params?: OrganizationCalendarParams
    ): Promise<MotorsportRegResponse<CalendarResponse>> {
        return this.request<MotorsportRegResponse<CalendarResponse>>(
            `/rest/calendars/organization/${organizationId}/type/${typeId}`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get all events from all calendars (authenticated)
     */
    async getAllCalendars(
        params?: AuthenticatedCalendarParams
    ): Promise<MotorsportRegResponse<CalendarResponse>> {
        return this.request<MotorsportRegResponse<CalendarResponse>>(
            "/rest/calendars",
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get details about a single event (authenticated)
     */
    async getEvent(
        eventId: string
    ): Promise<MotorsportRegResponse<{ event: EventDetail }>> {
        return this.request<MotorsportRegResponse<{ event: EventDetail }>>(
            `/rest/calendars/${eventId}`
        );
    }

    /**
     * Get calendar of events for a single venue (authenticated)
     */
    async getVenueCalendar(
        venueId: string,
        params?: AuthenticatedCalendarParams
    ): Promise<MotorsportRegResponse<CalendarResponse>> {
        return this.request<MotorsportRegResponse<CalendarResponse>>(
            `/rest/calendars/venue/${venueId}`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get calendar of events for a single event type (authenticated)
     */
    async getTypeCalendar(
        typeId: string,
        params?: AuthenticatedCalendarParams
    ): Promise<MotorsportRegResponse<CalendarResponse>> {
        return this.request<MotorsportRegResponse<CalendarResponse>>(
            `/rest/calendars/type/${typeId}`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get entry list for an event (unauthenticated - public data only)
     */
    async getEventEntryList(
        eventId: string
    ): Promise<MotorsportRegResponse<AttendeesResponse>> {
        return this.request<MotorsportRegResponse<AttendeesResponse>>(
            `/rest/events/${eventId}/entrylist`
        );
    }

    /**
     * Get complete list of attendees for an event (authenticated)
     */
    async getEventAttendees(
        eventId: string,
        params?: {
            fields?: "questions" | "packages" | "questions,packages";
            registered_since?: string;
            lastupdate_since?: string;
            precise_timestamps?: boolean;
        }
    ): Promise<MotorsportRegResponse<AttendeesResponse>> {
        return this.request<MotorsportRegResponse<AttendeesResponse>>(
            `/rest/events/${eventId}/attendees`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Get a single attendee (authenticated)
     */
    async getAttendee(
        eventId: string,
        attendeeId: string,
        params?: {
            fields?: "questions" | "packages" | "questions,packages";
        }
    ): Promise<MotorsportRegResponse<{ attendee: AttendeesResponse["attendees"][0] }>> {
        return this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}`,
            {
                params: params as Record<string, string | number | boolean>,
            }
        );
    }

    /**
     * Update an attendee (authenticated)
     */
    async updateAttendee(
        eventId: string,
        attendeeId: string,
        data: {
            status?: string;
            notes?: string;
            metadata?: Record<string, unknown>;
        }
    ): Promise<MotorsportRegResponse<{ attendee: AttendeesResponse["attendees"][0] }>> {
        return this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}`,
            {
                method: "PUT",
                body: data,
            }
        );
    }

    /**
     * Get assignments for an event (authenticated)
     */
    async getEventAssignments(
        eventId: string
    ): Promise<MotorsportRegResponse<{ assignments: unknown[] }>> {
        return this.request(`/rest/events/${eventId}/assignments`);
    }

    /**
     * Delete an attendee (authenticated)
     */
    async deleteAttendee(
        eventId: string,
        attendeeId: string
    ): Promise<void> {
        await this.request(`/rest/events/${eventId}/attendees/${attendeeId}`, {
            method: "DELETE",
        });
    }

    /**
     * Get check-in history for an attendee (authenticated)
     */
    async getAttendeeCheckin(
        eventId: string,
        attendeeId: string
    ): Promise<MotorsportRegResponse<{ checkin: unknown }>> {
        return this.request(`/rest/events/${eventId}/attendees/${attendeeId}/checkin`);
    }

    /**
     * Create check-in for an attendee (authenticated)
     */
    async createAttendeeCheckin(
        eventId: string,
        attendeeId: string,
        data: {
            notes?: string;
        }
    ): Promise<MotorsportRegResponse<{ checkin: unknown }>> {
        return this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}/checkin`,
            {
                method: "POST",
                body: data,
            }
        );
    }

    /**
     * Update check-in for an attendee (authenticated)
     */
    async updateAttendeeCheckin(
        eventId: string,
        attendeeId: string,
        data: {
            notes?: string;
        }
    ): Promise<MotorsportRegResponse<{ checkin: unknown }>> {
        return this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}/checkin`,
            {
                method: "PUT",
                body: data,
            }
        );
    }

    /**
     * Remove check-in for an attendee (authenticated)
     */
    async deleteAttendeeCheckin(
        eventId: string,
        attendeeId: string
    ): Promise<void> {
        await this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}/checkin`,
            {
                method: "DELETE",
            }
        );
    }

    /**
     * Get a single assignment (authenticated)
     */
    async getAssignment(
        eventId: string,
        assignmentId: string
    ): Promise<MotorsportRegResponse<{ assignment: Assignment }>> {
        return this.request(`/rest/events/${eventId}/assignments/${assignmentId}`);
    }

    /**
     * Get assignments for a specific attendee (authenticated)
     */
    async getAttendeeAssignments(
        eventId: string,
        attendeeId: string
    ): Promise<MotorsportRegResponse<AssignmentsResponse>> {
        return this.request(
            `/rest/events/${eventId}/attendees/${attendeeId}/assignments`
        );
    }

    /**
     * Get user profile and organization memberships (OAuth authenticated)
     */
    async getMe(): Promise<MotorsportRegResponse<{
        profile: unknown;
        organizations: unknown[];
    }>> {
        return this.request("/rest/me");
    }

    /**
     * Get user's vehicles (OAuth authenticated)
     */
    async getMyVehicles(): Promise<MotorsportRegResponse<{ vehicles: unknown[] }>> {
        return this.request("/rest/me/vehicles");
    }

    /**
     * Get a single vehicle (OAuth authenticated)
     */
    async getMyVehicle(
        vehicleId: string
    ): Promise<MotorsportRegResponse<{ vehicle: unknown }>> {
        return this.request(`/rest/me/vehicles/${vehicleId}`);
    }

    /**
     * Get user's event registrations (OAuth authenticated)
     */
    async getMyEvents(): Promise<MotorsportRegResponse<{ events: Event[] }>> {
        return this.request("/rest/me/events");
    }

    /**
     * Get postal codes within radius (authenticated)
     */
    async getPostalCodes(
        postalCode: string,
        radius?: number
    ): Promise<MotorsportRegResponse<{ postalcodes: unknown[] }>> {
        return this.request(`/rest/postalcodes/${postalCode}`, {
            params: radius ? { radius } : undefined,
        });
    }
}

/**
 * Default service instance
 * Configure via environment variables:
 * - MOTORSPORTREG_API_KEY
 * - MOTORSPORTREG_USERNAME
 * - MOTORSPORTREG_PASSWORD
 * - MOTORSPORTREG_ORGANIZATION_ID
 */
export const motorsportRegService = new MotorsportRegService();

/**
 * Create a configured service instance
 */
export function createMotorsportRegService(
    config?: MotorsportRegConfig
): MotorsportRegService {
    return new MotorsportRegService(config);
}

