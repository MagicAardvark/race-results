"use client";

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
import { Button } from "@/ui/button-wrapper";
import { Field, FieldSeparator } from "@/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Stack } from "@/app/components/shared/stack";
import { createBaseClass } from "@/app/(global-admin)/admin/classes/_lib/actions/create-base-class";
import { useState } from "react";
import { FormResponse } from "@/types/forms";
import {
    Form,
    FormInput,
    FormSelect,
    FormError,
} from "@/app/components/forms/form";
import { newBaseClassSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { BaseCarClass, ClassCategory, ClassType } from "@/dto/classes-admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormRadioGroup } from "@/app/components/forms/form-radio-group";

type AddBaseClassDialogProps = {
    classTypes: ClassType[];
    classCategories: ClassCategory[];
};

export const AddBaseClassDialog = ({
    classTypes,
    classCategories,
}: AddBaseClassDialogProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof newBaseClassSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(newBaseClassSchema as any),
        defaultValues: {
            shortName: "",
            longName: "",
            classTypeKey: "",
            classCategoryId: "",
            isIndexed: true,
            indexValue: 0.8,
        },
    });

    const [error, setError] = useState<FormResponse<BaseCarClass> | null>(null);
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof newBaseClassSchema>) => {
        const result = await createBaseClass(data);

        if (result.isError) {
            setError(result);
            return;
        }

        toast.success(result.message);
        cleanup();
        router.push(`/admin/classes/${result.data?.classId}`);
    };

    const cleanup = () => {
        setOpen(false);
        form.reset();
        setError(null);
    };

    const watchIsIndexed = useWatch({
        control: form.control,
        name: "isIndexed",
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
                <Button>Add Class</Button>
            </DialogTrigger>

            <DialogContent>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Add Base Class</DialogTitle>
                            <DialogDescription>
                                Creates a global base class available to all
                                organizations.
                            </DialogDescription>
                        </DialogHeader>

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

                        <FormSelect
                            form={form}
                            name="classTypeKey"
                            label="Class Type"
                            placeholder="Class Type"
                            items={[
                                {
                                    value: "Invalid",
                                    label: "None",
                                },
                                ...classTypes.map((ct) => ({
                                    value: ct.classTypeKey,
                                    label: ct.shortName,
                                })),
                            ]}
                        />

                        <FormSelect
                            form={form}
                            name="classCategoryId"
                            label="Class Category"
                            placeholder="Class Category"
                            items={[
                                {
                                    value: "Invalid",
                                    label: "None",
                                },
                                ...classCategories.map((cc) => ({
                                    value: cc.classCategoryId,
                                    label: cc.longName,
                                })),
                            ]}
                        />

                        <FieldSeparator />

                        <FormRadioGroup
                            form={form}
                            name="isIndexed"
                            groupLabel="Indexing"
                            groupDescription={
                                <Stack className="mt-2">
                                    <p>
                                        Indicates whether this class will be
                                        indexed or will compete on raw time.
                                    </p>
                                    <p>
                                        <strong>Note:</strong> this cannot be
                                        changed after creation.
                                    </p>
                                </Stack>
                            }
                            options={[
                                {
                                    title: "Indexed",
                                    description:
                                        "Class will be indexed using the specified index value.",
                                    value: "true",
                                },
                                {
                                    title: "Raw Time",
                                    description:
                                        "Class will compete on raw time without indexing.",
                                    value: "false",
                                },
                            ]}
                        />

                        {watchIsIndexed && (
                            <FormInput
                                form={form}
                                name="indexValue"
                                label="Index Value"
                                type="number"
                                step="0.001"
                                placeholder="e.g. .800"
                            />
                        )}

                        <DialogFooter>
                            <Field orientation="horizontal">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
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
