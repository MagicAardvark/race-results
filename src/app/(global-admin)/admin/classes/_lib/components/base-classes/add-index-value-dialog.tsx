import { createIndexValue } from "@/app/(global-admin)/admin/classes/_lib/actions/create-index-value";
import { addIndexValueSchema } from "@/app/(global-admin)/admin/classes/_lib/schema";
import {
    Form,
    FormError,
    FormInput,
    FormSelect,
} from "@/app/components/forms/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface AddIndexValueDialogProps {
    classId: string;
    className: string;
    existingYears: number[];
}

export const AddIndexValueDialog = ({
    classId,
    className,
    existingYears,
}: AddIndexValueDialogProps) => {
    const nextYear = new Date().getFullYear() + 1;
    const backTo = 2000;
    const selectYears = Array.from(
        { length: nextYear - backTo + 1 },
        (_, i) => nextYear - i
    );

    const form = useForm<z.infer<typeof addIndexValueSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(addIndexValueSchema as any),
        defaultValues: {
            indexValue: 0.8,
            year:
                selectYears.find((y) => !existingYears.includes(Number(y))) ??
                nextYear,
        },
    });

    const [error, setError] = useState<FormResponse | null>(null);
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof addIndexValueSchema>) => {
        const result = await createIndexValue(classId, {
            indexValue: data.indexValue,
            year: data.year,
        });

        if (result.isError) {
            setError(result);
            return;
        }

        toast.success("Index value added successfully");
        form.reset();
        setError(null);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Index Value</Button>
            </DialogTrigger>
            <DialogContent>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Add Index Value</DialogTitle>
                            <DialogDescription>
                                Add a new index value for {className}.
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        <FormSelect
                            form={form}
                            name="year"
                            label="Year"
                            items={selectYears.map((year) => {
                                const existingYear =
                                    existingYears.includes(year);

                                return {
                                    value: year,
                                    label: `${year}${existingYear ? " (Index value exists)" : ""}`,
                                    disabled: existingYear,
                                };
                            })}
                        />

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
