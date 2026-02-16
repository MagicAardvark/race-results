"use client";

import { FormError } from "@/app/components/forms/form-error";
import { Stack } from "@/app/components/shared/stack";
import { FormResponse } from "@/types/forms";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { FieldGroup } from "@/ui/field";
import { baseEventSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultFormActions,
    Form,
    FormInput,
    FormSelect,
} from "@/app/components/forms/form";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { useState } from "react";
import { FormDatePicker } from "@/app/components/forms/form-date-picker";
import { toast } from "sonner";
import { createEvent } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/create-event";
import { Button } from "@/ui/button-wrapper";
import { useOrgMsrEvents } from "@/hooks/msr/use-org-msr-events";
import { AlertTriangle } from "lucide-react";
import { addDays, format } from "date-fns";

type CreateEventDialogProps = {
    orgId: string;
    isMsrConfigured: boolean;
    seasonId: string;
};

export const CreateEventDialog = ({
    orgId,
    isMsrConfigured,
    seasonId,
}: CreateEventDialogProps) => {
    const today = new Date();
    const form = useForm<z.infer<typeof baseEventSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(baseEventSchema as any),
        defaultValues: {
            isLinkedToMsrEvent: isMsrConfigured,
            msrEventId: "",
            name: "",
            startDate: format(today, "yyyy-MM-dd"),
            isMultiDay: false,
            endDate: format(addDays(today, 1), "yyyy-MM-dd"),
        },
    });

    const {
        isLoading,
        isError: isMsrError,
        msrEvents,
    } = useOrgMsrEvents(isMsrConfigured);

    const [error, setError] = useState<FormResponse | null>(null);
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof baseEventSchema>) => {
        const result = await createEvent(orgId, seasonId, data);

        if (result.isError) {
            setError(result);
            return;
        }

        cleanup();
        toast.success(result.message);
    };

    const cleanup = () => {
        setOpen(false);
        form.reset();
        setError(null);
    };

    const watchIsMultiDay = useWatch({
        control: form.control,
        name: "isMultiDay",
    });

    const watchIsLinkedToMsrEvent = useWatch({
        control: form.control,
        name: "isLinkedToMsrEvent",
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    cleanup();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button>Create event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Create event</DialogTitle>
                            <DialogDescription asChild>
                                <Stack>
                                    <span className="leading-relaxed">
                                        Add a single-day or multi-day event for
                                        this organization.
                                    </span>
                                    <span className="leading-relaxed">
                                        This schedule is shown on the
                                        organization&apos;s page.
                                    </span>
                                    <span className="leading-relaxed">
                                        Optionally, you can link this event to
                                        an existing MotorsportReg event.
                                    </span>
                                </Stack>
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        {isMsrError && isMsrConfigured && (
                            <Stack className="text-red-700">
                                <AlertTriangle className="mx-auto" size={24} />
                                <div className="text-center text-sm text-red-700">
                                    Failed to load MotorsportReg events. Please
                                    try again later.
                                </div>
                            </Stack>
                        )}

                        {!isLoading && (
                            <>
                                <FieldGroup>
                                    {isMsrConfigured && (
                                        <>
                                            <FormCheckbox
                                                form={form}
                                                name="isLinkedToMsrEvent"
                                                label="Link to MotorsportReg event"
                                            />

                                            {watchIsLinkedToMsrEvent && (
                                                <FormSelect
                                                    form={form}
                                                    name="msrEventId"
                                                    label="MotorsportReg event"
                                                    placeholder={
                                                        isLoading
                                                            ? "Loading events…"
                                                            : isMsrError
                                                              ? "Error loading events"
                                                              : msrEvents?.length === 0
                                                                ? "No events available"
                                                                : "Select an event"
                                                    }
                                                    items={
                                                        msrEvents?.length === 0
                                                            ? []
                                                            : msrEvents
                                                              ? msrEvents.map(
                                                                        (
                                                                            event
                                                                        ) => ({
                                                                            value: event.id,
                                                                            label: event.name,
                                                                        })
                                                                )
                                                              : []
                                                    }
                                                />
                                            )}
                                        </>
                                    )}

                                    <FormInput
                                        form={form}
                                        name="name"
                                        label="Event Name"
                                        placeholder="Event name"
                                    />

                                    <FormCheckbox
                                        form={form}
                                        name="isMultiDay"
                                        label="Multi-day event"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <FormDatePicker
                                                form={form}
                                                name="startDate"
                                                label={`${watchIsMultiDay ? "Start Date" : "Date"}`}
                                            />
                                        </div>

                                        <div>
                                            {watchIsMultiDay && (
                                                <FormDatePicker
                                                    form={form}
                                                    name="endDate"
                                                    label="End Date"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </FieldGroup>

                                <DefaultFormActions
                                    onCancel={() => cleanup()}
                                    onSubmitDisabled={
                                        form.formState.isSubmitting
                                    }
                                    onSubmitText={
                                        form.formState.isSubmitting
                                            ? "Saving…"
                                            : "Save"
                                    }
                                />
                            </>
                        )}
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
