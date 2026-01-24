"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button-wrapper";
import { Field } from "@/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Stack } from "@/app/components/shared/stack";
import { createClassGroup } from "@/app/(global-admin)/admin/organizations/_lib/actions/class-groups";
import { useState } from "react";
import { FormResponse } from "@/types/forms";
import { Form, FormError } from "@/app/components/forms/form";
import { createClassGroupSchema } from "@/app/(global-admin)/admin/organizations/_lib/schema/class-groups";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { toast } from "sonner";
import { ClassGroupDialogProps } from "./_lib/types";
import { FormattedInput } from "./_lib/form-fields";
import { ClassSelectionField } from "./_lib/class-selection-field";

type CreateClassGroupDialogProps = ClassGroupDialogProps;

export const CreateClassGroupDialog = ({
    orgId,
    availableBaseClasses,
    open,
    onOpenChange,
    onSuccess,
}: CreateClassGroupDialogProps) => {
    type FormData = z.infer<typeof createClassGroupSchema>;

    const form = useForm<FormData>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createClassGroupSchema as any),
        mode: "onBlur",
        defaultValues: {
            shortName: "",
            longName: "",
            classIds: [],
        },
    });

    const [error, setError] =
        useState<FormResponse<ClassGroupWithClasses> | null>(null);

    const onSubmit = async (data: FormData) => {
        setError(null);

        try {
            const result = await createClassGroup(orgId, data);

            if (result.isError) {
                setError(result);
                toast.error(
                    result.errors?.[0] || "Failed to create class group"
                );
                return;
            }

            toast.success(result.message);
            onSuccess(result.data!);
            form.reset();
            setError(null);
            onOpenChange(false);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";
            setError({
                isError: true,
                errors: [errorMessage],
            });
            toast.error(errorMessage);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit(onSubmit, (errors) => {
            if (Object.keys(errors).length > 0) {
                toast.error("Please fix the form errors before submitting");
            }
        })(e);
    };

    const cleanup = () => {
        form.reset();
        setError(null);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) {
                    cleanup();
                }
            }}
        >
            <DialogContent>
                <Form onSubmit={handleFormSubmit}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Create Class Group</DialogTitle>
                            <DialogDescription>
                                Create a new class group for this organization.
                                You can add base classes to the group (global or
                                org-specific).
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        <FormattedInput
                            form={form}
                            name="shortName"
                            label="Short Name"
                            placeholder="e.g. SSM"
                            format="uppercase"
                        />

                        <FormattedInput
                            form={form}
                            name="longName"
                            label="Long Name"
                            placeholder="e.g. Super Street Modified"
                            format="titleCase"
                        />

                        <ClassSelectionField
                            form={form}
                            name="classIds"
                            availableClasses={availableBaseClasses}
                        />

                        <DialogFooter>
                            <Field orientation="horizontal">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cleanup}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? "Creating…"
                                        : "Create"}
                                </Button>
                            </Field>
                        </DialogFooter>
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
