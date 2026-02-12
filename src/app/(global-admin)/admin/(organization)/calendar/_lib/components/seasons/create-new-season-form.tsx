import { createSeason } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/seasons/create-season";
import { createSeasonSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema/seasons";
import {
    DefaultFormActions,
    Form,
    FormError,
    FormInput,
} from "@/app/components/forms/form";
import { FormDatePicker } from "@/app/components/forms/form-date-picker";
import { Stack } from "@/app/components/shared/stack";
import { Season } from "@/dto/events/seasons";
import { FormResponse } from "@/types/forms";
import { FieldGroup } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type CreateNewSeasonProps = {
    orgId: string;
    onCreate: (season: Season) => void;
    onCancel: () => void;
};

export const CreateNewSeasonForm = ({
    orgId,
    onCreate,
    onCancel,
}: CreateNewSeasonProps) => {
    const form = useForm<z.infer<typeof createSeasonSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createSeasonSchema as any),
        defaultValues: {
            name: "",
            startAt: undefined,
            endAt: undefined,
        },
    });

    const [error, setError] = useState<FormResponse<Season> | null>(null);

    const onSubmit = async (data: z.infer<typeof createSeasonSchema>) => {
        const result = await createSeason(orgId, data);

        if (result.isError || !result.data) {
            setError(result);
            return;
        }

        toast.success(result.message);

        onCreate(result.data);
    };

    return (
        <div>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
                <Stack>
                    {error?.isError && (
                        <FormError
                            isError={error.isError}
                            messages={error.errors}
                        />
                    )}

                    <FieldGroup>
                        <FormInput form={form} name="name" label="Name" />

                        <Stack orientation="horizontal">
                            <FormDatePicker
                                form={form}
                                name="startAt"
                                label="Start Date"
                            />
                            <FormDatePicker
                                form={form}
                                name="endAt"
                                label="End Date"
                            />
                        </Stack>
                    </FieldGroup>

                    <DefaultFormActions
                        onCancel={() => onCancel()}
                        onSubmitDisabled={form.formState.isSubmitting}
                        onSubmitText={
                            form.formState.isSubmitting ? "Saving…" : "Save"
                        }
                    />
                </Stack>
            </Form>
        </div>
    );
};
