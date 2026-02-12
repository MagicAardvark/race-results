import { UpdateEventForm } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/update-event";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { eventsService } from "@/services/events/events.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page({
    params,
}: {
    params: Promise<{ season: string; eventId: string }>;
}) {
    const { season, eventId } = await params;

    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    const event = await eventsService.getEvent(org.orgId, eventId);

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div>
            <UpdateEventForm org={org} event={event} season={season} />
        </div>
    );
}
