/**
 * Example usage of MotorsportReg Service
 * 
 * This file demonstrates how to use the MotorsportReg API service
 * in various contexts (server components, API routes, etc.)
 */

import { motorsportRegService, createMotorsportRegService } from "./motorsportreg.service";
import { ApiError } from "@/lib/errors/app-errors";

// Example 1: Using default service instance (uses env vars or default API key)
export async function getOrganizationEventsExample(organizationId: string) {
    try {
        const response = await motorsportRegService.getOrganizationCalendar(
            organizationId,
            {
                postalcode: "02134",
                radius: 100,
                exclude_cancelled: true,
            }
        );

        return response.response.events;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(`API Error: ${error.message}`, error.statusCode);
        }
        throw error;
    }
}

// Example 2: Using authenticated service
export async function getAuthenticatedEventsExample() {
    const service = createMotorsportRegService({
        username: process.env.MOTORSPORTREG_USERNAME,
        password: process.env.MOTORSPORTREG_PASSWORD,
        organizationId: process.env.MOTORSPORTREG_ORGANIZATION_ID,
    });

    try {
        const response = await service.getAllCalendars({
            start: "2024-01-01",
            end: "2024-12-31",
            exclude_cancelled: true,
        });

        return response.response.events;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(`API Error: ${error.message}`, error.statusCode);
        }
        throw error;
    }
}

// Example 3: Get event attendees
export async function getEventAttendeesExample(eventId: string) {
    const service = createMotorsportRegService({
        username: process.env.MOTORSPORTREG_USERNAME,
        password: process.env.MOTORSPORTREG_PASSWORD,
        organizationId: process.env.MOTORSPORTREG_ORGANIZATION_ID,
    });

    try {
        const response = await service.getEventAttendees(eventId, {
            fields: "questions,packages",
            precise_timestamps: true,
        });

        return response.response.attendees;
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(`API Error: ${error.message}`, error.statusCode);
        }
        throw error;
    }
}

// Example 4: Using in a Next.js Server Component
// In your page.tsx or component:
/*
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";

export default async function EventsPage() {
    const response = await motorsportRegService.getOrganizationCalendar("org-id");
    const events = response.response.events;

    return (
        <div>
            {events.map((event) => (
                <div key={event.id}>
                    <h2>{event.name}</h2>
                    <p>{event.venue.name}, {event.venue.city}</p>
                    <p>{event.start} - {event.end}</p>
                </div>
            ))}
        </div>
    );
}
*/

// Example 5: Using in an API Route
// In app/api/events/route.ts:
/*
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
        return NextResponse.json({ error: "orgId required" }, { status: 400 });
    }

    try {
        const response = await motorsportRegService.getOrganizationCalendar(orgId);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
*/

