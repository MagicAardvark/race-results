"use server";

import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";
import { FormResponse } from "@/types/forms";

export const rebuildOrgCalendar = async (
    orgSlug: string
): Promise<FormResponse> => {
    await requireRole(ROLES.admin);

    try {
        await publicCalendarService.updateCacheForOrg(orgSlug);

        return {
            isError: false,
            message: `Public calendar cache rebuilt for organization ${orgSlug}`,
        };
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : `An unknown error occurred while rebuilding public calendar cache for organization ${orgSlug}`,
        };
    }
};
