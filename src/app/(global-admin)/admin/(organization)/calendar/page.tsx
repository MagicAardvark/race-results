import { CalendarTab } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/calendar-tab";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { EventDTO } from "@/dto/events";
import { Season } from "@/dto/events/seasons";
import { seasonsService } from "@/services/events/seasons.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

export default async function Page() {
    const storedTenant = await getStoredTenant();

    if (!storedTenant) {
        return null;
    }

    const org = await organizationAdminService.findBySlug(storedTenant);

    if (org === null) {
        return null;
    }

    const seasons = await seasonsService.getSeasonsForOrg(org.orgId);

    let events: EventDTO[] = [];
    let selectedSeason: Season | undefined;

    if (seasons.length > 0) {
        selectedSeason = seasons[0];
    }

    if (selectedSeason) {
        events = await orgEventsRepository.listByOrgIdAndSeasonId(
            selectedSeason.seasonId,
            org.orgId
        );
    }

    return (
        <CalendarTab
            orgId={org.orgId}
            events={events}
            seasons={seasons}
            selectedSeason={selectedSeason}
        />
    );
}
