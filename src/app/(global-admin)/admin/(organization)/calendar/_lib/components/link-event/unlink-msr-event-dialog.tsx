import { unlinkEvent } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/link-event/unlink-event";
import { FormError } from "@/app/components/forms/form-error";
import { FormResponse } from "@/types/forms";
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
import { useState } from "react";
import { toast } from "sonner";

type UnlinkMsrEventDialogProps = {
    orgId: string;
    eventId: string;
};

export default function UnlinkMsrEventDialog({
    orgId,
    eventId,
}: UnlinkMsrEventDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<FormResponse | null>(null);
    const [pending, setPending] = useState(false);

    const handleUnlink = async () => {
        setPending(true);

        const result = await unlinkEvent(orgId, eventId);

        if (result.isError) {
            setError(result);
            setPending(false);
            return;
        }

        toast.warning("Event unlinked");
        setPending(false);
    };

    const cleanup = () => {
        setOpen(false);
        setError(null);
        setPending(false);
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
                <Button variant="destructive">Unlink Event</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Unlink from MotorsportReg Event
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            Are you sure you want to unlink this event from its
                            MotorsportReg event?
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
                        onClick={() => cleanup()}
                        disabled={pending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={pending}
                        variant={"destructive"}
                        onClick={handleUnlink}
                    >
                        {pending ? "Unlinking..." : "Unlink Event"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
