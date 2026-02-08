import { EventDTO } from "@/dto/events";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { Button } from "@/ui/button-wrapper";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteEvent } from "@/app/(global-admin)/admin/_lib/actions/organizations/calendar/delete-event";
import { FormResponse } from "@/types/forms";
import { FormError } from "@/app/components/forms/form";
import { toast } from "sonner";

type DeleteEventDialogProps = {
    orgId: string;
    event: EventDTO;
};

export const DeleteEventDialog = ({ orgId, event }: DeleteEventDialogProps) => {
    const [error, setError] = useState<FormResponse | null>(null);
    const [open, setOpen] = useState(false);
    // const [deleteEvent, setDeleteEvent] = useState<OrgEventDTO | null>(null);
    const [deletePending, setDeletePending] = useState(false);

    const handleDelete = async () => {
        setDeletePending(true);

        const result = await deleteEvent(event.eventId, orgId);

        setDeletePending(false);

        if (result.isError) {
            setError(result);
            return;
        }

        cleanup();
        toast.warning(`${event.name} deleted`);
    };

    const cleanup = () => {
        setOpen(false);
        setError(null);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    cleanup();
                }
            }}
        >
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={`Delete ${event.name}`}
                >
                    <TrashIcon size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete event</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2">
                            <p>
                                Are you sure you want to delete{" "}
                                <strong>{event.name}</strong>? This cannot be
                                undone.
                            </p>
                            {error?.isError && (
                                <FormError
                                    isError={error.isError}
                                    messages={error.errors}
                                />
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deletePending}
                        onClick={() => cleanup()}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deletePending}
                        onClick={handleDelete}
                    >
                        {deletePending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
