# MotorsportReg API Service

A TypeScript service for interacting with the [MotorsportReg.com API](https://api.motorsportreg.com/).

## Configuration

The service can be configured via environment variables or by passing a config object:

### Environment Variables

```env
MOTORSPORTREG_API_KEY=your-api-key-here
MOTORSPORTREG_USERNAME=your-username
MOTORSPORTREG_PASSWORD=your-password
MOTORSPORTREG_ORGANIZATION_ID=your-org-id
```

### Direct Configuration

```typescript
import { createMotorsportRegService } from "@/services/motorsportreg/motorsportreg.service";

const service = createMotorsportRegService({
    apiKey: MOTORSPORTREG_API_KEY,
    username: "your-username",
    password: "your-password",
    organizationId: "your-org-id",
    format: "json", // json, xml, jsonp, rss, atom, ics
});
```

## Usage Examples

### Using the Default Service Instance

```typescript
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";

// Get organization calendar (unauthenticated)
const calendar = await motorsportRegService.getOrganizationCalendar("org-id", {
    postalcode: "02134",
    radius: 100,
    archive: false,
});

console.log(calendar.response.events);
```

### Authenticated Requests

For authenticated requests, you need to provide username/password and organization ID:

```typescript
import { createMotorsportRegService } from "@/services/motorsportreg/motorsportreg.service";

const service = createMotorsportRegService({
    username: "your-username",
    password: "your-password",
    organizationId: "your-org-id",
});

// Get all calendars (authenticated)
const allCalendars = await service.getAllCalendars({
    start: "2024-01-01",
    end: "2024-12-31",
    exclude_cancelled: true,
});

// Get event details
const event = await service.getEvent("event-id");

// Get attendees for an event
const attendees = await service.getEventAttendees("event-id", {
    fields: "questions,packages",
    precise_timestamps: true,
});
```

### Error Handling

```typescript
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import { ApiError } from "@/lib/errors/app-errors";

try {
    const calendar = await motorsportRegService.getOrganizationCalendar("org-id");
} catch (error) {
    if (error instanceof ApiError) {
        console.error(`API Error (${error.statusCode}):`, error.message);
        console.error("Response:", error.response);
    } else {
        console.error("Unexpected error:", error);
    }
}
```

## Available Methods

### Unauthenticated Endpoints

- `getOrganizationCalendar(organizationId, params?)` - Get events for an organization
- `getOrganizationCalendarByType(organizationId, typeId, params?)` - Get events by type
- `getEventEntryList(eventId)` - Get public entry list

### Authenticated Endpoints

- `getAllCalendars(params?)` - Get all events
- `getEvent(eventId)` - Get event details
- `getVenueCalendar(venueId, params?)` - Get events for a venue
- `getTypeCalendar(typeId, params?)` - Get events by type
- `getEventAttendees(eventId, params?)` - Get complete attendee list
- `getAttendee(eventId, attendeeId, params?)` - Get single attendee
- `updateAttendee(eventId, attendeeId, data)` - Update attendee
- `getEventAssignments(eventId)` - Get event assignments
- `getPostalCodes(postalCode, radius?)` - Get nearby postal codes

## Response Formats

The service supports multiple response formats:

- `json` (default) - JSON response
- `xml` - XML response
- `jsonp` - JSONP response
- `rss` - RSS feed
- `atom` - Atom feed
- `ics` - iCalendar format

Set the format when creating the service:

```typescript
const service = createMotorsportRegService({
    format: "rss",
});
```

## TypeScript Types

All responses are fully typed. Import types from:

```typescript
import type {
    Event,
    Venue,
    CalendarResponse,
    AttendeesResponse,
    // ... other types
} from "@/dto/motorsportreg";
```

