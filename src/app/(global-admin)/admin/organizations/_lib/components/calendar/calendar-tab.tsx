"use client";

import { CreateEventDialog } from "@/app/(global-admin)/admin/organizations/_lib/components/calendar/create-event-dialog";
import { DeleteEventDialog } from "@/app/(global-admin)/admin/organizations/_lib/components/calendar/delete-event-dialog";
import { UpdateEventDialog } from "@/app/(global-admin)/admin/organizations/_lib/components/calendar/update-event-dialog";
import { EventDTO } from "@/dto/events";
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
    orgSlug: string;
    events: EventDTO[];
};

export function CalendarTab({ orgId, orgSlug, events }: CalendarTabProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Organization events</CardTitle>
                        <CreateEventDialog orgId={orgId} orgSlug={orgSlug} />
                    </div>
                    <CardDescription>
                        <p className="leading-relaxed">
                            This schedule is shown on the organization’s page.
                            When a matching MotorsportReg event is found, it
                            will be linked automatically.
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
                                                <UpdateEventDialog
                                                    orgId={orgId}
                                                    orgSlug={orgSlug}
                                                    event={event}
                                                />
                                                <DeleteEventDialog
                                                    orgId={orgId}
                                                    orgSlug={orgSlug}
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
