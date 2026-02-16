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
import { Field, FieldGroup } from "@/ui/field";
import { Button } from "@/ui/button";
import { Stack } from "@/app/components/shared/stack";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormError, FormInput } from "@/app/components/forms/form";
import { FormResponse } from "@/types/forms";
import { createOrganization } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/actions/create-org";
import { toast } from "sonner";
import { switchTenant } from "@/app/(global-admin)/admin/_lib/actions/switch-tenant";

const createOrganizationSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
});

interface CreateOrgDialogProps {
    setOpen: (open: boolean) => void;
    open: boolean;
}

export const CreateOrgDialog = ({ setOpen, open }: CreateOrgDialogProps) => {
    const form = useForm<z.infer<typeof createOrganizationSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createOrganizationSchema as any),
        defaultValues: {
            name: "",
        },
    });

    const [error, setError] = useState<FormResponse<{ slug: string }> | null>(
        null
    );

    const onSumit = async (data: z.infer<typeof createOrganizationSchema>) => {
        const result = await createOrganization(data.name);

        if (result.isError) {
            setError(result);
            return;
        }

        cleanup();
        toast.success(result.message);

        if (result.data) {
            await switchTenant(result.data.slug);
        }
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
            <DialogContent size="large">
                <Form onSubmit={form.handleSubmit(onSumit)}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Create Organization</DialogTitle>
                            <DialogDescription>
                                Enter the name of the new organization.
                            </DialogDescription>
                        </DialogHeader>

                        {error?.isError && (
                            <FormError
                                isError={error.isError}
                                messages={error.errors}
                            />
                        )}

                        <FieldGroup>
                            <FormInput
                                form={form}
                                name="name"
                                label="Name"
                                placeholder="Pizza Club"
                            />
                        </FieldGroup>

                        <DialogFooter>
                            <Field orientation="horizontal">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
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
