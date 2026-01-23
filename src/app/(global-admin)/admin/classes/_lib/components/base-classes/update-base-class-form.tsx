"use client";

import { updateBaseClass } from "@/app/(global-admin)/admin/classes/_lib/actions/update-base-class";
import { updateBaseClassSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import {
    DefaultFormActions,
    Form,
    FormInput,
} from "@/app/components/forms/form";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { FormError } from "@/app/components/forms/form-error";
import { Stack } from "@/app/components/shared/stack";
import { BaseCarClass } from "@/dto/classes-admin";
import { FormResponse } from "@/types/forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface BaseClassFormProps {
    baseClass: BaseCarClass;
}

export const UpdateBaseClassForm = ({ baseClass }: BaseClassFormProps) => {
    const form = useForm<z.infer<typeof updateBaseClassSchema>>({
        resolver: zodResolver(updateBaseClassSchema),
        mode: "onBlur", // Validate on every change
        defaultValues: {
            shortName: baseClass.shortName,
            longName: baseClass.longName,
            isEnabled: baseClass.isEnabled,
        },
    });

    const [error, setError] = useState<FormResponse<BaseCarClass> | null>(null);

    const isEnabledOriginal = baseClass.isEnabled;

    const onSubmit = async (data: z.infer<typeof updateBaseClassSchema>) => {
        const result = await updateBaseClass(baseClass.classId, {
            shortName: data.shortName,
            longName: data.longName,
            isEnabled: data.isEnabled,
        });

        if (result.isError) {
            setError(result);
            return;
        }

        toast.success(result.message ?? "");

        form.reset(data);
        setError(null);
    };

    const watchIsEnabled = useWatch({
        control: form.control,
        name: "isEnabled",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Class Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}
                        <FormInput
                            form={form}
                            name="shortName"
                            label="Short Name"
                            placeholder="e.g. SS"
                        />

                        <FormInput
                            form={form}
                            name="longName"
                            label="Long Name"
                            placeholder="e.g. Super Street"
                        />

                        <FormCheckbox
                            form={form}
                            name="isEnabled"
                            label="Is Enabled"
                        />
                        {isEnabledOriginal != watchIsEnabled && (
                            <div className="flex items-center gap-2 rounded bg-yellow-200 p-2 text-sm text-yellow-900">
                                <span>
                                    <AlertTriangle />
                                </span>
                                <span>
                                    Changing the enabled status of a global base
                                    class will impact all organizations.
                                </span>
                            </div>
                        )}
                        <DefaultFormActions
                            onCancel={"/admin/classes"}
                            onSubmitDisabled={form.formState.isSubmitting}
                            onSubmitText={
                                form.formState.isSubmitting ? "Saving…" : "Save"
                            }
                        />
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );
};
