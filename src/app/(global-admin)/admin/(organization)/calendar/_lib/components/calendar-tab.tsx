"use client";

import { CreateEventDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/create-event-dialog";
import { DeleteEventDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/delete-event-dialog";
import { ChangeSeasonDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/change-season-dialog";
import { CreateNewSeasonDialog } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/create-new-season-dialog";
import { Stack } from "@/app/components/shared/stack";
import { EventDTO } from "@/dto/events";
import { Season } from "@/dto/events/seasons";
import { Button } from "@/ui/button-wrapper";
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

function isSingleDayEvent(start: Date, end: Date): boolean {
    const sameUtcDay =
        start.getUTCFullYear() === end.getUTCFullYear() &&
        start.getUTCMonth() === end.getUTCMonth() &&
        start.getUTCDate() === end.getUTCDate();
    const within24Hours = end.getTime() - start.getTime() < 24 * 60 * 60 * 1000;
    return sameUtcDay || within24Hours;
}

function eventDateRange(start: Date, end: Date): string {
    const startStr = formatEventDate(start);
    if (isSingleDayEvent(start, end)) return startStr;
    const endStr = formatEventDate(end);
    return `${startStr} – ${endStr}`;
}

type CalendarTabProps = {
    orgId: string;
    events: EventDTO[];
    seasons: Season[];
    selectedSeason: Season | undefined;
};

export function CalendarTab({
    orgId,
    events,
    seasons,
    selectedSeason,
}: CalendarTabProps) {
    const router = useRouter();

    if (seasons.length === 0 || !selectedSeason) {
        return (
            <div className="space-y-6">
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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            <Stack
                                orientation="horizontal"
                                className="items-center"
                            >
                                <div>{selectedSeason.name}</div>
                                <div>
                                    <ChangeSeasonDialog
                                        orgId={orgId}
                                        seasons={seasons}
                                        onChange={(seasonSlug: string) => {
                                            router.push(
                                                `/admin/calendar/${seasonSlug}`
                                            );
                                        }}
                                    />
                                </div>
                                {selectedSeason.isCurrent && (
                                    <div className="rounded-full bg-green-200 px-2 py-1 text-xs leading-relaxed">
                                        Active Season
                                    </div>
                                )}
                            </Stack>
                        </CardTitle>
                        <CreateEventDialog
                            orgId={orgId}
                            seasonId={selectedSeason.seasonId}
                        />
                    </div>
                    <CardDescription>
                        <p className="leading-relaxed">
                            The events for the {selectedSeason.name} season.
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <p className="text-muted-foreground py-6 text-center">
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
                                    <TableHead className="w-[100px] text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.eventId}>
                                        <TableCell className="font-medium">
                                            {event.name}
                                        </TableCell>
                                        <TableCell>
                                            {eventDateRange(
                                                event.startAt,
                                                event.endAt
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
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
