"use client";

import {
    createOrgEventAdmin,
    updateOrgEventAdmin,
    deleteOrgEventAdmin,
} from "@/app/actions/event.actions";
import type { OrgEventDTO } from "@/dto/org-events";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/ui/alert-dialog";
import { Button } from "@/ui/button-wrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

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

function toDateInputValue(d: Date | string | undefined): string {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
}

type CalendarTabProps = {
    orgId: string;
    orgSlug: string;
    events: OrgEventDTO[];
};

export function CalendarTab({ orgId, orgSlug, events }: CalendarTabProps) {
    const [state, formAction, pending] = useActionState(createOrgEventAdmin, {
        isError: false,
        message: "",
    });
    const [updateState, updateFormAction, updatePending] = useActionState(
        updateOrgEventAdmin,
        { isError: false, message: "" }
    );
    const [showEndDate, setShowEndDate] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editShowEndDate, setEditShowEndDate] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState<OrgEventDTO | null>(null);
    const [deletePending, setDeletePending] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [userOpenedCreateDialog, setUserOpenedCreateDialog] = useState(false);

    const updateSucceeded =
        updateState.message === "Event updated" && !updateState.isError;
    const createSucceeded = state.message === "Event created" && !state.isError;

    const editingEvent = editingEventId
        ? (events.find((e) => e.eventId === editingEventId) ?? null)
        : null;
    const isEditDialogOpen = !!editingEventId;
    const isCreateDialogOpen = userOpenedCreateDialog;

    // Close dialogs when the corresponding action succeeds
    useEffect(() => {
        if (createSucceeded) setUserOpenedCreateDialog(false);
    }, [createSucceeded]);
    useEffect(() => {
        if (updateSucceeded) setEditingEventId(null);
    }, [updateSucceeded]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Organization events</CardTitle>
                        <Button onClick={() => setUserOpenedCreateDialog(true)}>
                            Create event
                        </Button>
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
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingEventId(
                                                            event.eventId
                                                        );
                                                        setEditShowEndDate(
                                                            !isSingleDayEvent(
                                                                event.startAt,
                                                                event.endAt
                                                            )
                                                        );
                                                    }}
                                                    aria-label={`Edit ${event.name}`}
                                                >
                                                    <PencilIcon size={16} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setDeleteEvent(event);
                                                        setDeleteError(null);
                                                    }}
                                                    aria-label={`Delete ${event.name}`}
                                                >
                                                    <TrashIcon size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={(open) => {
                            setUserOpenedCreateDialog(open);
                            if (!open) setShowEndDate(false);
                        }}
                    >
                        <DialogContent className="sm:max-w-md">
                            <form
                                action={formAction}
                                className="space-y-4"
                                key="create-event"
                            >
                                <input
                                    type="hidden"
                                    name="orgId"
                                    value={orgId}
                                />
                                <input
                                    type="hidden"
                                    name="slug"
                                    value={orgSlug}
                                />
                                <DialogHeader>
                                    <DialogTitle>Create event</DialogTitle>
                                    <DialogDescription className="space-y-1.5">
                                        <p className="leading-relaxed">
                                            Add a single-day or multi-day event
                                            for this organization.
                                        </p>
                                        <p className="leading-relaxed">
                                            This schedule is shown on the
                                            organization’s page. When a matching
                                            MotorsportReg event is found, it
                                            will be linked automatically.
                                        </p>
                                    </DialogDescription>
                                </DialogHeader>
                                {(state.isError ||
                                    (state.message && !state.isError)) && (
                                    <p
                                        className={
                                            state.isError
                                                ? "text-destructive"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {state.message}
                                    </p>
                                )}
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Event name"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="date">
                                            Date
                                        </FieldLabel>
                                        <Input
                                            id="date"
                                            name="startDate"
                                            type="date"
                                            required
                                        />
                                    </Field>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="showEndDate"
                                            checked={showEndDate}
                                            onCheckedChange={(checked) =>
                                                setShowEndDate(checked === true)
                                            }
                                        />
                                        <FieldLabel
                                            htmlFor="showEndDate"
                                            className="cursor-pointer font-normal"
                                        >
                                            Multi-day event
                                        </FieldLabel>
                                    </div>
                                    {showEndDate && (
                                        <Field>
                                            <FieldLabel htmlFor="endDate">
                                                End date
                                            </FieldLabel>
                                            <Input
                                                id="endDate"
                                                name="endDate"
                                                type="date"
                                                required
                                            />
                                        </Field>
                                    )}
                                </FieldGroup>
                                <DialogFooter showCloseButton={false}>
                                    <Field orientation="horizontal">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setShowEndDate(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={pending}
                                        >
                                            {pending ? "Creating…" : "Create"}
                                        </Button>
                                    </Field>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => !open && setEditingEventId(null)}
            >
                <DialogContent
                    className="sm:max-w-md"
                    showCloseButton={!updatePending}
                >
                    <DialogHeader>
                        <DialogTitle>Edit event</DialogTitle>
                    </DialogHeader>
                    {editingEvent && (
                        <form
                            key={editingEvent.eventId}
                            action={updateFormAction}
                            className="space-y-4"
                        >
                            <input
                                type="hidden"
                                name="eventId"
                                value={editingEvent.eventId}
                            />
                            <input type="hidden" name="orgId" value={orgId} />
                            <input type="hidden" name="slug" value={orgSlug} />
                            {(updateState.isError ||
                                (updateState.message &&
                                    !updateState.isError)) && (
                                <p
                                    className={
                                        updateState.isError
                                            ? "text-destructive"
                                            : "text-muted-foreground"
                                    }
                                >
                                    {updateState.message}
                                </p>
                            )}
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="edit-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        defaultValue={editingEvent.name}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="edit-date">
                                        Date
                                    </FieldLabel>
                                    <Input
                                        id="edit-date"
                                        name="startDate"
                                        type="date"
                                        defaultValue={toDateInputValue(
                                            editingEvent.startAt
                                        )}
                                        required
                                    />
                                </Field>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="edit-showEndDate"
                                        checked={editShowEndDate}
                                        onCheckedChange={(checked) =>
                                            setEditShowEndDate(checked === true)
                                        }
                                    />
                                    <FieldLabel
                                        htmlFor="edit-showEndDate"
                                        className="cursor-pointer font-normal"
                                    >
                                        Multi-day event
                                    </FieldLabel>
                                </div>
                                {editShowEndDate && (
                                    <Field>
                                        <FieldLabel htmlFor="edit-endDate">
                                            End date
                                        </FieldLabel>
                                        <Input
                                            id="edit-endDate"
                                            name="endDate"
                                            type="date"
                                            defaultValue={toDateInputValue(
                                                editingEvent.endAt
                                            )}
                                            required
                                        />
                                    </Field>
                                )}
                            </FieldGroup>
                            <DialogFooter showCloseButton={false}>
                                <Field orientation="horizontal">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingEventId(null)}
                                        disabled={updatePending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updatePending}
                                    >
                                        {updatePending
                                            ? "Saving…"
                                            : "Save changes"}
                                    </Button>
                                </Field>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deleteEvent}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteEvent(null);
                        setDeleteError(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete event</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <p>
                                    Are you sure you want to delete &quot;
                                    {deleteEvent?.name}&quot;? This cannot be
                                    undone.
                                </p>
                                {deleteError && (
                                    <p className="text-destructive text-sm">
                                        {deleteError}
                                    </p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setDeleteEvent(null);
                                setDeleteError(null);
                            }}
                            disabled={deletePending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deletePending}
                            onClick={async () => {
                                if (!deleteEvent) return;
                                setDeletePending(true);
                                setDeleteError(null);
                                const result = await deleteOrgEventAdmin(
                                    deleteEvent.eventId,
                                    orgId,
                                    orgSlug
                                );
                                setDeletePending(false);
                                if (result.isError) {
                                    setDeleteError(result.message);
                                } else {
                                    setDeleteEvent(null);
                                }
                            }}
                        >
                            {deletePending ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
