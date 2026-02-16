"use client";

import { updateEventLink } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/link-event/update-event-link";
import { linkMsrEventSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema";
import { Form, FormError, FormSelect } from "@/app/components/forms/form";
import { Stack } from "@/app/components/shared/stack";
import { useOrgMsrEvents } from "@/hooks/msr/use-org-msr-events";
import { FormResponse } from "@/types/forms";
import { Button } from "@/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { Field } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type LinkMsrEventDialogProps = {
    orgId: string;
    eventId: string;
};

export default function LinkMsrEventDialog({
    orgId,
    eventId,
}: LinkMsrEventDialogProps) {
    const form = useForm<z.infer<typeof linkMsrEventSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(linkMsrEventSchema as any),
        defaultValues: {
            msrEventId: "",
        },
    });

    const { isLoading, isError: isMsrError, msrEvents } = useOrgMsrEvents(true);
    const [error, setError] = useState<FormResponse | null>(null);

    const onSubmit = async (data: z.infer<typeof linkMsrEventSchema>) => {
        const result = await updateEventLink(orgId, eventId, data.msrEventId);

        if (result.isError) {
            setError(result);
        }

        toast.success("Event linked to MotorsportReg event");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Link Event</Button>
            </DialogTrigger>
            <DialogContent size="large">
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack className="relative">
                        <DialogHeader>
                            <DialogTitle>
                                Link to MotorsportReg Event
                            </DialogTitle>
                            <DialogDescription asChild>
                                <Stack>
                                    <div>
                                        Syncing with an existing MotorsportReg
                                        event will give you access to additional
                                        event details and registration
                                        information, as well showing
                                        registration links and status on the
                                        public calendar.
                                    </div>
                                </Stack>
                            </DialogDescription>
                        </DialogHeader>

                        {isMsrError && (
                            <Stack className="text-red-700">
                                <AlertTriangle className="mx-auto" size={24} />
                                <div className="text-center text-sm text-red-700">
                                    Failed to load MotorsportReg events. Please
                                    try again later.
                                </div>
                            </Stack>
                        )}

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        {!isLoading && !isMsrError && (
                            <>
                                <FormSelect
                                    form={form}
                                    name="msrEventId"
                                    label="MotorsportReg Event"
                                    placeholder={
                                        msrEvents.length === 0
                                            ? "No events available"
                                            : "Select an event to link"
                                    }
                                    items={
                                        msrEvents.length === 0
                                            ? []
                                            : [
                                                  {
                                                      value: "NO_EVENT",
                                                      label: "Select an event to link",
                                                  },
                                                  ...msrEvents.map((e) => ({
                                                      value: e.id,
                                                      label: e.name,
                                                  })),
                                              ]
                                    }
                                />

                                <DialogFooter>
                                    <Field orientation="horizontal">
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                        >
                                            {form.formState.isSubmitting
                                                ? "Saving…"
                                                : "Save"}
                                        </Button>
                                    </Field>
                                </DialogFooter>
                            </>
                        )}
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
