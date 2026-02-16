"use client";

import {
    FormInput,
    FormSelect,
} from "@/app/components/forms/form";
import { FormCheckbox } from "@/app/components/forms/form-checkbox";
import { FormError } from "@/app/components/forms/form-error";
import { Stack } from "@/app/components/shared/stack";
import { BaseCarClass, ClassCategory, ClassType } from "@/dto/classes-admin";
import { FormResponse } from "@/types/forms";
import { updateBaseClassSchema } from "@/app/(global-admin)/admin/(global)/classes/_lib/schema";
import { AlertTriangle, CalculatorIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { CgStopwatch } from "react-icons/cg";
import z from "zod";

type UpdateBaseClassSchema = z.infer<typeof updateBaseClassSchema>;

interface EditBaseClassFormFieldsProps {
    form: UseFormReturn<UpdateBaseClassSchema>;
    baseClass: BaseCarClass;
    classTypes: ClassType[];
    classCategories: ClassCategory[];
    error: FormResponse<BaseCarClass> | null;
}

export function EditBaseClassFormFields({
    form,
    baseClass,
    classTypes,
    classCategories,
    error,
}: EditBaseClassFormFieldsProps) {
    const watchIsEnabled = useWatch({
        control: form.control,
        name: "isEnabled",
    });
    const isEnabledOriginal = baseClass.isEnabled;

    return (
        <Stack>
            <div className="flex items-center gap-2">
                {baseClass.isIndexed ? (
                    <>
                        <CalculatorIcon size={16} />
                        This class is configured to compete on indexed time.
                    </>
                ) : (
                    <>
                        <CgStopwatch size={16} />
                        This class is configured to compete on raw time.
                    </>
                )}
            </div>

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
                    { value: "None", label: "None" },
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
                    { value: "None", label: "None" },
                    ...classCategories.map((cc) => ({
                        value: cc.classCategoryId,
                        label: cc.longName,
                    })),
                ]}
            />

            <FormCheckbox
                form={form}
                name="isEnabled"
                label="Is Enabled"
            />

            {isEnabledOriginal !== watchIsEnabled && (
                <div className="flex items-center gap-2 rounded bg-yellow-200 p-2 text-sm text-yellow-900">
                    <AlertTriangle />
                    <span>
                        Changing the enabled status of a global base class will
                        impact all organizations.
                    </span>
                </div>
            )}
        </Stack>
    );
}
