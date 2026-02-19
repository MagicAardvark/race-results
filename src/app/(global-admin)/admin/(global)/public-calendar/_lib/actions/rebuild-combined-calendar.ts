"use server";

import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";
import { FormResponse } from "@/types/forms";

export async function rebuildCombinedPublicCalendar(): Promise<FormResponse> {
    await requireRole(ROLES.admin);

    try {
        await publicCalendarService.updateCacheForAllOrgs();

        return {
            isError: false,
            message: "Public calendar cache rebuilt for all organizations",
        };
    } catch (error) {
        return {
            isError: true,
            errors:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while rebuilding public calendar cache",
        };
    }
}
