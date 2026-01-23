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
import { Field } from "@/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Stack } from "@/app/components/shared/stack";
import { createBaseClass } from "@/app/(global-admin)/admin/classes/_lib/actions/create-base-class";
import { useState } from "react";
import { FormError } from "@/app/components/forms/form-error";
import { FormResponse } from "@/types/forms";
import { Form, FormInput } from "@/app/components/forms/form";
import { newBaseClassSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { BaseCarClass } from "@/dto/classes-admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AddBaseClassDialog = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof newBaseClassSchema>>({
        resolver: zodResolver(newBaseClassSchema),
        mode: "onBlur", // Validate on every change
        defaultValues: {
            shortName: "",
            longName: "",
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
