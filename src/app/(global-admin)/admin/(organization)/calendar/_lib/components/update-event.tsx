"use client";

import { updateEvent } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/update-event";
import LinkMsrEventDialog from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/link-event/link-msr-event-dialog";
import UnlinkMsrEventDialog from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/link-event/unlink-msr-event-dialog";
import { baseEventSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema";
import {
    DefaultFormActions,
    Form,
    FormError,
    FormInput,
} from "@/app/components/forms/form";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { FormDatePicker } from "@/app/components/forms/form-date-picker";
import { Stack } from "@/app/components/shared/stack";
import { EventDTO } from "@/dto/events";
import { FormResponse } from "@/types/forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { FieldGroup } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type UpdateEventDialogProps = {
    orgId: string;
    season: string;
    event: EventDTO;
};

export const UpdateEventForm = ({
    orgId,
    season,
    event,
}: UpdateEventDialogProps) => {
    const form = useForm<z.infer<typeof baseEventSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(baseEventSchema as any),
        defaultValues: {
            name: event.name,
            startDate: event.startAt,
            isMultiDay: event.endAt !== event.startAt,
            endDate: event.endAt || undefined,
        },
    });

    const [error, setError] = useState<FormResponse | null>(null);

    const cleanup = () => {
        form.reset();
        setError(null);
    };

    const onSubmit = async (data: z.infer<typeof baseEventSchema>) => {
        const result = await updateEvent(orgId, event.eventId, data);

        if (result.isError) {
            setError(result);
            return;
        }

        cleanup();
        toast.success(result.message);
    };

    const watchIsMultiDay = useWatch({
        control: form.control,
        name: "isMultiDay",
    });

    return (
        <Stack>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Stack>
                        <Form onSubmit={form.handleSubmit(onSubmit)}>
                            <Stack>
                                {error?.isError && (
                                    <FormError
                                        isError={error.isError}
                                        messages={error.errors}
                                    />
                                )}

                                <FieldGroup>
                                    <FormInput
                                        form={form}
                                        name="name"
                                        label="Name"
                                        placeholder="Points 1"
                                    />

                                    <FormCheckbox
                                        form={form}
                                        name="isMultiDay"
                                        label="Multi-day event"
                                    />

                                    <Stack orientation="horizontal">
                                        <FormDatePicker
                                            form={form}
                                            name="startDate"
                                            label={`${watchIsMultiDay ? "Start Date" : "Date"}`}
                                        />

                                        {watchIsMultiDay && (
                                            <FormDatePicker
                                                form={form}
                                                name="endDate"
                                                label="End Date"
                                            />
                                        )}
                                    </Stack>
                                </FieldGroup>

                                <DefaultFormActions
                                    onCancel={`/admin/calendar/${season}`}
                                    onSubmitDisabled={
                                        form.formState.isSubmitting
                                    }
                                    onSubmitText={
                                        form.formState.isSubmitting
                                            ? "Saving…"
                                            : "Save"
                                    }
                                />
                            </Stack>
                        </Form>
                    </Stack>
                </CardContent>
            </Card>
            <Card className={`${event.msrEventId ? "" : "bg-red-50"}`}>
                <CardHeader>
                    <CardTitle>Linked MSR Event</CardTitle>
                </CardHeader>
                <CardContent>
                    {event.msrEventId ? (
                        <Stack>
                            <div>
                                This event has been linked to an MSR event.
                            </div>
                            <div>TODO: Show linked MSR event details here.</div>
                            <div>
                                <UnlinkMsrEventDialog
                                    orgId={orgId}
                                    eventId={event.eventId}
                                />
                            </div>
                        </Stack>
                    ) : (
                        <Stack>
                            <div className="inline-flex items-center gap-2 text-red-800">
                                <AlertTriangle size={16} />{" "}
                                <span>
                                    This event is not linked to an MSR event.
                                </span>
                            </div>
                            <div>
                                <LinkMsrEventDialog
                                    orgId={orgId}
                                    eventId={event.eventId}
                                />
                            </div>
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Stack>
    );
};
