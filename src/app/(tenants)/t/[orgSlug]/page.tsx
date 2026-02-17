import { tenantService } from "@/services/tenants/tenant.service";
import { ProfileIconImage } from "@/app/components/profile-icon-image";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { CgMediaLive as LiveIcon } from "react-icons/cg";
import { LIVE_TIMING_LABEL } from "@/app/components/shared/live-timing";
import { EventsSection } from "./_lib/components/events-section";
import { EventList } from "./_lib/components/event-list";
import { ClientTenantLink } from "@/app/(tenants)/t/_lib/components/client-tenant-link";
import { getTenantBasePath } from "@/app/(tenants)/t/_lib/utils/get-tenant-base-path";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

export default async function Page() {
    const org = await tenantService.getTenant();
    const basePath = await getTenantBasePath();
    const { past, upcoming } = await publicCalendarService.getPublicCalendar(
        org.slug
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <header
                className="mb-6 flex items-center justify-between"
                role="banner"
            >
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Organizations
                    </Link>
                </Button>
                <Button size="lg" asChild>
                    <ClientTenantLink
                        pathFromTenantRoot="/live"
                        tenantBase={basePath}
                    >
                        <LiveIcon className="mr-2 h-5 w-5 animate-pulse text-white" />
                        {LIVE_TIMING_LABEL}
                    </ClientTenantLink>
                </Button>
            </header>

            <main className="contents">
                <div className="mb-8 flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-bold sm:text-4xl">
                            {org.name}
                        </h1>
                        {org.description ? (
                            <p className="text-muted-foreground mt-2 max-w-2xl">
                                {org.description}
                            </p>
                        ) : null}
                    </div>
                    {org.profileIconUrl ? (
                        <ProfileIconImage
                            src={org.profileIconUrl}
                            alt=""
                            className="size-28 shrink-0 overflow-hidden rounded-xl sm:size-32"
                        />
                    ) : null}
                </div>

                <EventsSection
                    id="upcoming-events"
                    title="Upcoming Events"
                    variant="primary"
                    emptyMessage="No upcoming events scheduled. Check back soon."
                    hasItems={upcoming.length > 0}
                />
                {upcoming.length > 0 && (
                    <div className="mt-6 sm:mt-8">
                        <EventList
                            items={upcoming}
                            variant="upcoming"
                            displayMode="single-org"
                        />
                    </div>
                )}

                {past.length > 0 && (
                    <>
                        <EventsSection
                            id="past-events"
                            title="Past Events"
                            variant="muted"
                            hasItems
                        />
                        <div className="mt-6 sm:mt-8">
                            <EventList
                                items={past}
                                variant="past"
                                displayMode="single-org"
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
