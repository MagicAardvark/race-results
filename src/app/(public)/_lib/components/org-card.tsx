import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { ProfileIconImage } from "@/app/components/profile-icon-image";
import { LiveTimingLink } from "@/app/components/shared/live-timing";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import type { Organization } from "@/dto/organizations";
import { formatDateRange, getDateString } from "@/lib/date-utils";

const DEFAULT_ORG_HEADER_IMAGE = "/hero-header.svg";

export type NextEvent = {
    name: string;
    startDate: Date;
    endDate: Date;
};

type OrgCardProps = {
    org: Organization;
    upcomingCount: number;
    nextEvent: NextEvent | null;
    today: string;
};

export function OrgCard({
    org,
    upcomingCount,
    nextEvent,
    today,
}: OrgCardProps) {
    const headerSrc = org.headerImageUrl ?? DEFAULT_ORG_HEADER_IMAGE;
    const isExternal =
        headerSrc.startsWith("http://") || headerSrc.startsWith("https://");
    const isNextToday =
        nextEvent &&
        getDateString(nextEvent.startDate) <= today &&
        getDateString(nextEvent.endDate) >= today;

    return (
        <Card
            className={`flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md ${nextEvent ? "pb-0" : ""}`}
        >
            <Link
                href={`/t/${org.slug}`}
                className="group flex flex-1 flex-col"
                aria-label={`View ${org.name}`}
            >
                <div className="bg-muted relative aspect-[800/300] w-full shrink-0 overflow-hidden rounded-t-xl">
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
                        <p className="mt-0.5 font-medium">{nextEvent.name}</p>
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
                        <p className="mt-0.5 font-medium">{nextEvent.name}</p>
                    </div>
                    <Button size="sm" className="shrink-0" asChild>
                        <LiveTimingLink href={`/t/${org.slug}/live`} />
                    </Button>
                </div>
            )}
        </Card>
    );
}
