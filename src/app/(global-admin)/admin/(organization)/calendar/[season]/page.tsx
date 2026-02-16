import { CalendarTab } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/calendar-tab";
import { EventDetail } from "@/dto/events";
import { Season } from "@/dto/events/seasons";
import { requireOrgAccess } from "@/lib/auth/require-org-access";
import { eventsService } from "@/services/events/events.service";
import { seasonsService } from "@/services/events/seasons.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function OrganizationCalendarPage({
    params,
}: {
    params: Promise<{ season?: string }>;
}) {
    const { season } = await params;
    // Catch all route [[...season]]: season is an array or undefined
    const seasonSlug = season ?? undefined;

    const { currentOrg } = await requireOrgAccess();

    const org = await organizationAdminService.findBySlug(currentOrg.slug);

    if (org === null) {
        return null;
    }

    const seasons = await seasonsService.getSeasonsForOrg(org.orgId);

    let events: EventDetail[] = [];
    let selectedSeason: Season | undefined;

    if (seasons.length > 0) {
        if (seasonSlug) {
            selectedSeason = seasons.find((s) => s.slug === seasonSlug);
        }

        if (!selectedSeason) {
            selectedSeason = seasons[0];
        }
    }

    if (selectedSeason) {
        events = await eventsService.getEvents(
            org.orgId,
            selectedSeason.seasonId
        );
    }

    return (
        <CalendarTab
            org={org}
            events={events}
            seasons={seasons}
            selectedSeason={selectedSeason}
        />
    );
}
