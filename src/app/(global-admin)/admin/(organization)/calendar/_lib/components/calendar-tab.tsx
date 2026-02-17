"use client";

import { CreateEventDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/create-event-dialog";
import { DeleteEventDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/delete-event-dialog";
import { ChangeSeasonDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/change-season-dialog";
import { CreateNewSeasonDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/create-new-season-dialog";
import { Stack } from "@/app/components/shared/stack";
import { EventDetail } from "@/dto/events";
import { Season } from "@/dto/events/seasons";
import { OrganizationExtended } from "@/dto/organizations";
import { Button } from "@/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatEventDate(d: Date): string {
    const parts = d.toISOString().slice(0, 10).split("-");
    if (parts.length !== 3) return d.toLocaleDateString();
    const [y, m, day] = parts;
    const date = new Date(
        parseInt(y!, 10),
        parseInt(m!, 10) - 1,
        parseInt(day!, 10)
    );
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function eventDateRange(
    isMultiDay: boolean,
    start: string,
    end: string
): string {
    const startStr = formatEventDate(new Date(start));
    if (!isMultiDay) return startStr;
    const endStr = formatEventDate(new Date(end));
    return `${startStr} – ${endStr}`;
}

type CalendarTabProps = {
    org: OrganizationExtended;
    events: EventDetail[];
    seasons: Season[];
    selectedSeason: Season | undefined;
};

export function CalendarTab({
    org,
    events,
    seasons,
    selectedSeason,
}: CalendarTabProps) {
    const router = useRouter();

    const isMsrConfigured = !!org.motorsportregOrgId;
    const orgId = org.orgId;

    if (seasons.length === 0 || !selectedSeason) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>
                            <Stack>
                                <p className="leading-relaxed">
                                    You need to create at least one season
                                    before adding events.
                                </p>

                                <div>
                                    <CreateNewSeasonDialog
                                        orgId={orgId}
                                        onChange={(seasonSlug: string) => {
                                            router.push(
                                                `/admin/calendar/${seasonSlug}`
                                            );
                                        }}
                                    />
                                </div>
                            </Stack>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <p className="text-muted-foreground text-sm">
                View and manage events by season. Add single-day or multi-day
                events. If MotorsportReg Org ID is set for this org, you can
                link events to import from MotorsportReg.
            </p>
            <Card className="w-full">
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                    <Stack orientation="horizontal" gap="small">
                        <span className="font-medium">
                            {selectedSeason.name}
                        </span>
                        <ChangeSeasonDialog
                            orgId={orgId}
                            seasons={seasons}
                            onChange={(seasonSlug: string) => {
                                router.push(`/admin/calendar/${seasonSlug}`);
                            }}
                        />
                        {selectedSeason.isCurrent && (
                            <span className="rounded-full bg-green-200 px-2 py-1 text-xs leading-relaxed">
                                Active Season
                            </span>
                        )}
                    </Stack>
                    <CreateEventDialog
                        orgId={orgId}
                        isMsrConfigured={isMsrConfigured}
                        seasonId={selectedSeason.seasonId}
                    />
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <p className="text-muted-foreground py-6 text-center text-sm">
                            No events yet. Create one to get started.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[200px]">
                                        Event
                                    </TableHead>
                                    <TableHead className="min-w-[180px]">
                                        Date
                                    </TableHead>
                                    <TableHead className="w-0 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.eventId}>
                                        <TableCell>
                                            <div className="flex h-full items-center gap-2">
                                                <div className="font-medium">
                                                    {event.name}
                                                </div>
                                                {event.msrEventId && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-pointer rounded-full bg-green-200 px-2 py-0.5 text-[10px] leading-relaxed">
                                                                MSR
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            This event is linked
                                                            to an MSR event.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {eventDateRange(
                                                event.isMultiDay,
                                                event.startDate,
                                                event.endDate
                                            )}
                                        </TableCell>
                                        <TableCell className="w-0 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/calendar/${selectedSeason?.slug}/event/${event.eventId}`}
                                                    >
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <DeleteEventDialog
                                                    orgId={orgId}
                                                    event={event}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
