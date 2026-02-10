import { UpdateEventForm } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/update-event";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { eventsService } from "@/services/events/events.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page({
    params,
}: {
    params: Promise<{ season: string; eventId: string }>;
}) {
    const { season, eventId } = await params;

    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return null;
    }

    const org = await organizationAdminService.findBySlug(storedTenant);

    if (org === null) {
        return null;
    }

    const event = await eventsService.getEvent(org.orgId, eventId);

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div>
            <UpdateEventForm orgId={org.orgId} event={event} season={season} />
        </div>
    );
}
