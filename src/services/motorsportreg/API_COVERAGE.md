# MotorsportReg API Coverage

This document tracks which API endpoints are implemented in the service. 

This is an AI generated doc that can give us insight into what APIs SR exposes without using their horrible docs. 

## ✅ Implemented Endpoints

### Unauthenticated Endpoints
- ✅ `GET /rest/calendars/organization/{organization_id}` - Get organization calendar
- ✅ `GET /rest/calendars/organization/{organization_id}/type/{type_id}` - Get calendar by type
- ✅ `GET /rest/events/{event_id}/entrylist` - Get public entry list

### Authenticated Endpoints (Basic Auth)
- ✅ `GET /rest/calendars` - Get all calendars
- ✅ `GET /rest/calendars/{event_id}` - Get event details
- ✅ `GET /rest/calendars/venue/{venue_id}` - Get venue calendar
- ✅ `GET /rest/calendars/type/{type_id}` - Get calendar by type
- ✅ `GET /rest/postalcodes/{postal_code}` - Get nearby postal codes

### Event Attendees (Authenticated)
- ✅ `GET /rest/events/{event_id}/attendees` - Get all attendees
- ✅ `GET /rest/events/{event_id}/attendees/{attendee_id}` - Get single attendee
- ✅ `PUT /rest/events/{event_id}/attendees/{attendee_id}` - Update attendee
- ✅ `DELETE /rest/events/{event_id}/attendees/{attendee_id}` - Delete attendee

### Check-in Management (Authenticated)
- ✅ `GET /rest/events/{event_id}/attendees/{attendee_id}/checkin` - Get check-in
- ✅ `POST /rest/events/{event_id}/attendees/{attendee_id}/checkin` - Create check-in
- ✅ `PUT /rest/events/{event_id}/attendees/{attendee_id}/checkin` - Update check-in
- ✅ `DELETE /rest/events/{event_id}/attendees/{attendee_id}/checkin` - Remove check-in

### Assignments (Authenticated)
- ✅ `GET /rest/events/{event_id}/assignments` - Get all assignments
- ✅ `GET /rest/events/{event_id}/assignments/{assignment_id}` - Get single assignment
- ✅ `GET /rest/events/{event_id}/attendees/{attendee_id}/assignments` - Get attendee assignments

### OAuth User Endpoints (OAuth 1.0a Required)
- ✅ `GET /rest/me` - Get user profile and organizations
- ✅ `GET /rest/me/vehicles` - Get user's vehicles
- ✅ `GET /rest/me/vehicles/{vehicle_id}` - Get single vehicle
- ✅ `GET /rest/me/events` - Get user's event registrations

## ⚠️ Not Yet Implemented

### OAuth Flow Endpoints
- ❌ `POST /rest/tokens/request` - Get OAuth request token
- ❌ `POST /rest/tokens/access` - Exchange request token for access token
- *Note: These require OAuth 1.0a implementation which is more complex. Currently only Basic Auth is supported.*

### Segments Endpoints (Documentation Truncated)
- ❌ `GET /rest/events/{event_id}/segments/{segment_id}/...` - Various segment endpoints
- *Note: The API documentation was truncated for segments. These may need to be added as needed.*

### Event Management (If Available)
- ❌ Event creation/update/deletion endpoints (if they exist)
- *Note: The documentation doesn't clearly show if these endpoints exist.*

### Other Potential Endpoints
- ❌ Member management endpoints (if available)
- ❌ Organization management endpoints (if available)
- ❌ Other endpoints that may exist but weren't in the provided documentation

## Notes

1. **OAuth Support**: The service currently supports Basic Auth (username/password). OAuth 1.0a endpoints are documented but not implemented as they require a more complex OAuth flow.

2. **Response Formats**: All endpoints support multiple formats (JSON, XML, JSONP, RSS, Atom, iCalendar) via the `format` config option.

3. **Authentication Methods**:
   - **Basic Auth**: Username/password with `X-Organization-Id` header
   - **OAuth 1.0a**: Not yet implemented (requires OAuth library)

4. **Missing Endpoints**: If you discover additional endpoints that aren't listed here, they can be easily added using the `request()` method or by adding new methods to the service class.

## Adding Missing Endpoints

To add a missing endpoint, you can either:

1. **Add a method to the service class** (recommended for common endpoints):
```typescript
async getSomeEndpoint(id: string): Promise<ResponseType> {
    return this.request<ResponseType>(`/rest/some/endpoint/${id}`);
}
```

2. **Extend the service class** (for custom implementations):
```typescript
class CustomMotorsportRegService extends MotorsportRegService {
    async getCustomEndpoint(id: string) {
        return this.request(`/rest/custom/${id}`);
    }
}
```

