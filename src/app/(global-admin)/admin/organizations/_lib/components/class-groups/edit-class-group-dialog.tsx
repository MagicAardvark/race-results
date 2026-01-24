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
import {
    updateClassGroup,
    getClassGroup,
} from "@/app/(global-admin)/admin/organizations/_lib/actions/class-groups";
import { useState, useEffect } from "react";
import { FormResponse } from "@/types/forms";
import { Form, FormError } from "@/app/components/forms/form";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { updateClassGroupSchema } from "@/app/(global-admin)/admin/organizations/_lib/schema/class-groups";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { toast } from "sonner";
import { ClassGroupDialogProps } from "./_lib/types";
import { FormattedInput } from "./_lib/form-fields";
import { ClassSelectionField } from "./_lib/class-selection-field";

interface EditClassGroupDialogProps extends ClassGroupDialogProps {
    classGroupId: string;
}

export const EditClassGroupDialog = ({
    orgId,
    classGroupId,
    availableBaseClasses,
    open,
    onOpenChange,
    onSuccess,
}: EditClassGroupDialogProps) => {
    const [loading, setLoading] = useState(true);
    const [classGroup, setClassGroup] = useState<ClassGroupWithClasses | null>(
        null
    );

    type FormData = z.infer<typeof updateClassGroupSchema>;

    const form = useForm<FormData>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(updateClassGroupSchema as any),
        defaultValues: {
            classGroupId: "",
            shortName: "",
            longName: "",
            isEnabled: true,
            classIds: [],
        },
    });

    const [error, setError] =
        useState<FormResponse<ClassGroupWithClasses> | null>(null);

    useEffect(() => {
        if (!open || !classGroupId) {
            return;
        }

        let cancelled = false;

        const loadClassGroup = async () => {
            try {
                const group = await getClassGroup(orgId, classGroupId);
                if (!cancelled && group) {
                    setClassGroup(group);
                    form.reset({
                        classGroupId: group.classGroupId,
                        shortName: group.shortName,
                        longName: group.longName,
                        isEnabled: group.isEnabled,
                        classIds: group.classIds,
                    });
                }
            } catch {
                if (!cancelled) {
                    toast.error("Failed to load class group");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        loadClassGroup();

        return () => {
            cancelled = true;
        };
    }, [open, classGroupId, orgId, form]);

    const onSubmit = async (data: FormData) => {
        const result = await updateClassGroup(orgId, data);

        if (result.isError) {
            setError(result);
            return;
        }

        toast.success(result.message);
        onSuccess(result.data!);
        setError(null);
        onOpenChange(false);
    };

    const cleanup = () => {
        form.reset();
        setError(null);
    };

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div className="py-8 text-center">Loading...</div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!classGroup) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div className="text-destructive py-8 text-center">
                        Class group not found
                    </div>
                </DialogContent>
            </Dialog>
        );
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
            <DialogContent>
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

                        <FormCheckbox<z.infer<typeof updateClassGroupSchema>>
                            form={form}
                            name="isEnabled"
                            label="Is Enabled"
                        />

                        <ClassSelectionField
                            form={form}
                            name="classIds"
                            availableClasses={availableBaseClasses}
                        />

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
