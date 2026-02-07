import { updateEvent } from "@/app/(global-admin)/admin/_lib/actions/organizations/calendar/update-event";
import { baseEventSchema } from "@/app/(global-admin)/admin/_lib/schema/organizations/calendar";
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
import { Button } from "@/ui/button-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { FieldGroup } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type UpdateEventDialogProps = {
    orgId: string;
    orgSlug: string;
    event: EventDTO;
};

export const UpdateEventDialog = ({
    orgId,
    orgSlug,
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
    const [open, setOpen] = useState(false);

    const cleanup = () => {
        setOpen(false);
        form.reset();
        setError(null);
    };

    const onSubmit = async (data: z.infer<typeof baseEventSchema>) => {
        const result = await updateEvent(orgId, orgSlug, event.eventId, data);

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
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={`Edit ${event.name}`}
                >
                    <PencilIcon size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Edit event</DialogTitle>
                            <DialogDescription asChild>
                                <Stack>
                                    <span className="leading-relaxed">
                                        Edit a single-day or multi-day event for
                                        this organization.
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

                        <FieldGroup>
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
                            onCancel={() => cleanup()}
                            onSubmitDisabled={form.formState.isSubmitting}
                            onSubmitText={
                                form.formState.isSubmitting ? "Saving…" : "Save"
                            }
                        />
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
