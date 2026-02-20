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
import { Button } from "@/ui/button";
import { Field, FieldDescription, FieldLegend, FieldSet } from "@/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Stack } from "@/app/components/shared/stack";
import { createClassGroup } from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/actions/class-groups";
import { useState } from "react";
import { FormResponse } from "@/types/forms";
import { Form, FormError } from "@/app/components/forms/form";
import { handleFormActionResult } from "@/app/components/forms/handle-form-action-result";
import { createClassGroupSchema } from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/schema/class-groups";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { toast } from "sonner";
import { ClassGroupDialogProps } from "../types";
import { FormattedInput } from "../form-fields";
import { ClassSelectionField } from "../class-selection-field";
import { FormRadioGroup } from "@/app/components/forms/form-radio-group";

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
            identificationMode: "BASE_CLASS_ONLY",
            classIds: [],
        },
    });

    const [error, setError] =
        useState<FormResponse<ClassGroupWithClasses> | null>(null);

    const onSubmit = async (data: FormData) => {
        setError(null);

        try {
            const result = await createClassGroup(orgId, data);
            if (!handleFormActionResult(result, setError)) return;

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
            <DialogContent size="large">
                <Form onSubmit={handleFormSubmit}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Create Class Group</DialogTitle>
                            <DialogDescription>
                                Create a new class group for this organization.
                                Base classes, global or org-specific, are added
                                to the group.
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        <FieldSet>
                            <FieldLegend>Group Identifiers</FieldLegend>
                            <FieldDescription>
                                How this group will be identified.
                            </FieldDescription>

                            <FormattedInput
                                form={form}
                                name="shortName"
                                label="Short Name"
                                placeholder="e.g. P or N"
                                format="uppercase"
                            />

                            <FormattedInput
                                form={form}
                                name="longName"
                                label="Long Name"
                                placeholder="e.g. Pro or Novice"
                                format="titleCase"
                            />
                        </FieldSet>

                        <FormRadioGroup
                            form={form}
                            name="identificationMode"
                            groupLabel="Car Identification"
                            groupDescription="Will cars in this class have their regular class
                            identifiers prepended with the group identifier?"
                            options={[
                                {
                                    title: "Entries register as base class only (most common)",
                                    description:
                                        "Cars will run with their base class identifiers, e.g. AS",
                                    value: "BASE_CLASS_ONLY",
                                },
                                {
                                    title: "Entries register as part of the group along with their base class",
                                    description:
                                        "Cars will run with both the group identifier and their base class identifiers, e.g. PAS or NAS",
                                    value: "GROUP_PLUS_BASE_CLASS",
                                },
                            ]}
                        />

                        <FieldSet>
                            <FieldLegend>Included Classes</FieldLegend>
                            <FieldDescription>
                                Selected classes will be included in this group.
                            </FieldDescription>
                            <ClassSelectionField
                                form={form}
                                name="classIds"
                                availableClasses={availableBaseClasses}
                            />
                        </FieldSet>

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
                                        ? "Saving…"
                                        : "Save"}
                                </Button>
                            </Field>
                        </DialogFooter>
                    </Stack>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
