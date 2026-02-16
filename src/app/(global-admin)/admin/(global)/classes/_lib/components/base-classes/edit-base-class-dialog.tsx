"use client";

import { updateBaseClass } from "@/app/(global-admin)/admin/(global)/classes/_lib/actions/update-base-class";
import { IndexConfiguration } from "@/app/(global-admin)/admin/(global)/classes/_lib/components/base-classes/index-configuration";
import { EditBaseClassFormFields } from "@/app/(global-admin)/admin/(global)/classes/_lib/components/base-classes/update-base-class-form";
import { updateBaseClassSchema } from "@/app/(global-admin)/admin/(global)/classes/_lib/schema";
import { BaseCarClass, ClassCategory, ClassType } from "@/dto/classes-admin";
import { FormResponse } from "@/types/forms";
import { Stack } from "@/app/components/shared/stack";
import { Form } from "@/app/components/forms/form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/dialog";
import { Field } from "@/ui/field";
import { Button } from "@/ui/button-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface EditBaseClassDialogProps {
    /** When null, nothing is rendered. When set, dialog is open for that class. */
    editingBaseClass: BaseCarClass | null;
    classTypes: ClassType[];
    classCategories: ClassCategory[];
}

const getDefaultValues = (baseClass: BaseCarClass | null) => ({
    shortName: baseClass?.shortName ?? "",
    longName: baseClass?.longName ?? "",
    classTypeKey: baseClass?.classType?.classTypeKey ?? "None",
    classCategoryId: baseClass?.classCategory?.classCategoryId ?? "None",
    isEnabled: baseClass?.isEnabled ?? true,
});

export const EditBaseClassDialog = ({
    editingBaseClass,
    classTypes,
    classCategories,
}: EditBaseClassDialogProps) => {
    const router = useRouter();
    const [error, setError] = useState<FormResponse<BaseCarClass> | null>(null);

    const form = useForm<z.infer<typeof updateBaseClassSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(updateBaseClassSchema as any),
        mode: "onBlur",
        defaultValues: getDefaultValues(editingBaseClass),
    });

    useEffect(() => {
        if (editingBaseClass) {
            form.reset(getDefaultValues(editingBaseClass));
            queueMicrotask(() => setError(null));
        }
    }, [editingBaseClass, form]);

    const onOpenChange = (open: boolean) => {
        if (!open) {
            router.push("/admin/classes");
        }
    };

    if (!editingBaseClass) {
        return null;
    }

    const baseClass = editingBaseClass;

    const onSubmit = async (data: z.infer<typeof updateBaseClassSchema>) => {
        const result = await updateBaseClass(baseClass.classId, {
            shortName: data.shortName,
            longName: data.longName,
            classTypeKey: data.classTypeKey,
            classCategoryId: data.classCategoryId,
            isEnabled: data.isEnabled,
        });

        if (result.isError) {
            setError(result);
            return;
        }

        toast.success(result.message ?? "");
        setError(null);
        onOpenChange(false);
    };

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent size="large">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                    }}
                >
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Edit Base Class</DialogTitle>
                            <DialogDescription>
                                Update class details and index values. Changes
                                apply globally across all organizations.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList>
                                <TabsTrigger value="general">
                                    General
                                </TabsTrigger>
                                <TabsTrigger
                                    value="indexConfiguration"
                                    disabled={!baseClass.isIndexed}
                                >
                                    Index Value
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="general">
                                <EditBaseClassFormFields
                                    form={form}
                                    baseClass={baseClass}
                                    classTypes={classTypes}
                                    classCategories={classCategories}
                                    error={error}
                                />
                            </TabsContent>
                            <TabsContent value="indexConfiguration">
                                <IndexConfiguration baseClass={baseClass} />
                            </TabsContent>
                        </Tabs>
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
