import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { organizationService } from "@/services/organizations/organization.service";
import {
    formatDateRange,
    getDateString,
} from "@/app/(tenants)/t/[orgSlug]/_lib/utils/date-utils";
import { ProfileIconImage } from "@/app/components/profile-icon-image";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/ui/button";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { LiveTimingLink } from "@/app/components/shared/live-timing";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

/** Default image for org cards when the org has not set a header. */
const DEFAULT_ORG_HEADER_IMAGE = "/hero-header.svg";

const HERO_IMAGE = "/hero-header.svg";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();
    const orgEvents = (
        await Promise.all(
            orgs.map(async (org) => ({
                slug: org.slug,
                events: await publicCalendarService.getPublicCalendar(org.slug),
            }))
        )
    ).map((details) => ({
        ...details,
        org: orgs.find((o) => o.slug === details.slug)!,
        upcomingCount: details.events.upcoming.length,
        nextEvent:
            details.events.upcoming.length > 0
                ? details.events.upcoming[0]
                : null,
    }));

    const today = getDateString(new Date());

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section
                className="relative min-h-[52.5vh] w-full overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
                aria-label="Hero"
            >
                <div
                    className="absolute inset-0 bg-linear-to-t from-slate-950 from-0% via-slate-950/40 to-transparent"
                    aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 z-10 w-full px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Live Timing & Results
                        </h1>
                        <p className="text-muted-foreground mb-6 text-base sm:text-lg">
                            Track motorsports results and live timing across all
                            your organizations
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button size="lg" asChild>
                                <Link href="#organizations">
                                    Browse Organizations
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="bg-white/95 text-slate-900 hover:bg-white"
                                asChild
                            >
                                <Link href="/events">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    View all events
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Organizations */}
            <section
                id="organizations"
                className="container mx-auto px-4 py-12 sm:py-16"
            >
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Organizations
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Select a club to view events, live timing, and
                            results
                        </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/events">View all events</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {orgEvents.map(({ org, nextEvent, upcomingCount }) => {
                        const headerSrc =
                            org.headerImageUrl ?? DEFAULT_ORG_HEADER_IMAGE;
                        const isExternal =
                            headerSrc.startsWith("http://") ||
                            headerSrc.startsWith("https://");
                        const isNextToday =
                            nextEvent &&
                            getDateString(nextEvent.startDate) <= today &&
                            getDateString(nextEvent.endDate) >= today;
                        return (
                            <Card
                                key={org.orgId}
                                className={`flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md ${nextEvent ? "pb-0" : ""}`}
                            >
                                <Link
                                    href={`/t/${org.slug}`}
                                    className="group flex flex-1 flex-col"
                                    aria-label={`View ${org.name}`}
                                >
                                    <div className="bg-muted relative aspect-800/300 w-full shrink-0 overflow-hidden rounded-t-xl">
                                        {isExternal ? (
                                            // eslint-disable-next-line @next/next/no-img-element -- external header URLs are not in remotePatterns
                                            <img
                                                src={headerSrc}
                                                alt=""
                                                className="h-full w-full object-cover object-center"
                                            />
                                        ) : (
                                            <Image
                                                src={headerSrc}
                                                alt=""
                                                fill
                                                className="object-cover object-center"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        )}
                                    </div>
                                    <CardHeader className="flex-1 space-y-3 py-2">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            {org.profileIconUrl ? (
                                                <ProfileIconImage
                                                    src={org.profileIconUrl}
                                                    alt=""
                                                    className="size-8 shrink-0 overflow-hidden rounded-lg"
                                                />
                                            ) : null}
                                            <span className="min-w-0 flex-1 truncate">
                                                {org.name}
                                            </span>
                                            <ArrowRightIcon className="h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {org.description ??
                                                "View events, live timing, and results"}
                                        </CardDescription>
                                        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                            <CalendarIcon
                                                className="h-4 w-4 shrink-0"
                                                aria-hidden
                                            />
                                            {upcomingCount === 0
                                                ? "No upcoming events"
                                                : `${upcomingCount} upcoming ${upcomingCount === 1 ? "event" : "events"}`}
                                        </p>
                                    </CardHeader>
                                    {nextEvent && !isNextToday && (
                                        <div className="bg-muted/50 rounded-b-xl border-t px-4 py-3 text-sm">
                                            <p className="text-muted-foreground font-medium">
                                                Next event
                                            </p>
                                            <p className="mt-0.5 font-medium">
                                                {nextEvent.name}
                                            </p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {formatDateRange(
                                                    nextEvent.startDate,
                                                    nextEvent.endDate
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </Link>
                                {nextEvent && isNextToday && (
                                    <div className="bg-muted/50 flex flex-col gap-3 rounded-b-xl border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                        <div>
                                            <p className="text-muted-foreground font-medium">
                                                Live now
                                            </p>
                                            <p className="mt-0.5 font-medium">
                                                {nextEvent.name}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="shrink-0"
                                            asChild
                                        >
                                            <LiveTimingLink
                                                href={`/t/${org.slug}/live`}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
