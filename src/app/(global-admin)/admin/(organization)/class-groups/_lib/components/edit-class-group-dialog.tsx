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
import { updateClassGroup } from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/actions/class-groups";
import { useState, useEffect } from "react";
import { FormResponse } from "@/types/forms";
import { Form, FormError } from "@/app/components/forms/form";
import { handleFormActionResult } from "@/app/components/forms/handle-form-action-result";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { updateClassGroupSchema } from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/schema/class-groups";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { ClassGroupDialogProps } from "../types";
import { FormattedInput } from "../form-fields";
import { ClassSelectionField } from "../class-selection-field";
import { FormRadioGroup } from "@/app/components/forms/form-radio-group";

interface EditClassGroupDialogProps extends ClassGroupDialogProps {
    /** Class group to edit. Passed from server-fed list to avoid client fetch (SSR). */
    classGroup: ClassGroupWithClasses | null;
}

export const EditClassGroupDialog = ({
    orgId,
    classGroup,
    availableBaseClasses,
    open,
    onOpenChange,
    onSuccess,
}: EditClassGroupDialogProps) => {
    const [error, setError] =
        useState<FormResponse<ClassGroupWithClasses> | null>(null);

    type FormData = z.infer<typeof updateClassGroupSchema>;

    const form = useForm<FormData>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(updateClassGroupSchema as any),
        defaultValues: {
            classGroupId: "",
            shortName: "",
            longName: "",
            identificationMode: "BASE_CLASS_ONLY",
            isEnabled: true,
            classIds: [],
        },
    });

    // Sync form when dialog opens with server-provided class group (no client fetch)
    useEffect(() => {
        if (open && classGroup) {
            form.reset({
                classGroupId: classGroup.classGroupId,
                shortName: classGroup.shortName,
                longName: classGroup.longName,
                identificationMode: classGroup.identificationMode,
                isEnabled: classGroup.isEnabled,
                classIds: classGroup.classIds,
            });
        }
    }, [open, classGroup, form]);

    const onSubmit = async (data: FormData) => {
        const result = await updateClassGroup(orgId, data);
        if (!handleFormActionResult(result, setError)) return;

        onSuccess(result.data!);
        setError(null);
        onOpenChange(false);
    };

    const cleanup = () => {
        form.reset();
        setError(null);
    };

    if (open && !classGroup) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent size="large">
                    <DialogHeader>
                        <DialogTitle>Edit Class Group</DialogTitle>
                        <DialogDescription asChild>
                            <div className="text-destructive py-6 text-center">
                                Class group not found
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    if (!classGroup) {
        return null;
    }

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
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                    }}
                >
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Edit Class Group</DialogTitle>
                            <DialogDescription>
                                Update the class group details and associated
                                classes.
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        <FormCheckbox<z.infer<typeof updateClassGroupSchema>>
                            form={form}
                            name="isEnabled"
                            label="Is Enabled"
                        />

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
                                    title: "No, cars will run with their regular class identifiers only (most common)",
                                    value: "BASE_CLASS_ONLY",
                                },
                                {
                                    title: "Yes, cars will run with the group identifier, i.e. PAS or NAS",
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
                                    <Button variant="outline" onClick={cleanup}>
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
