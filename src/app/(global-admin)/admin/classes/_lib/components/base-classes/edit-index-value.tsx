"use client";

import { updateIndexValue } from "@/app/(global-admin)/admin/classes/_lib/actions/update-index-value";
import { updateIndexValueSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import { Form, FormError, FormInput } from "@/app/components/forms/form";
import { Stack } from "@/app/components/shared/stack";
import { FormResponse } from "@/types/forms";
import { Button } from "@/ui/button";
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
import { Field } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface EditIndexValueDialogProps {
    className: string;
    indexValueId: string;
    value: number;
    year: number;
}

export const EditIndexValueDialog = ({
    className,
    indexValueId,
    value,
    year,
}: EditIndexValueDialogProps) => {
    const form = useForm<z.infer<typeof updateIndexValueSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(updateIndexValueSchema as any),
        defaultValues: {
            indexValue: value,
        },
    });

    const [error, setError] = useState<FormResponse | null>(null);
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof updateIndexValueSchema>) => {
        const result = await updateIndexValue(indexValueId, data.indexValue);

        if (result.isError) {
            setError(result);
            return;
        }

        form.reset();
        setError(null);
        setOpen(false);
        toast.success("Index value updated successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <PencilIcon size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Edit Index Value</DialogTitle>
                            <DialogDescription>
                                Modify the index value of {className} for {year}
                                .
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
                            name="indexValue"
                            label="Index Value"
                            type="number"
                            step={0.001}
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
