"use client";

import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
    PathValue,
} from "react-hook-form";
import { Field, FieldLabel } from "@/ui/field";
import { Button } from "@/ui/button-wrapper";
import { Checkbox } from "@/ui/checkbox";
import { AvailableBaseClass } from "./types";

interface ClassSelectionFieldProps<T extends FieldValues> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<T, any, any>;
    name: FieldPath<T>;
    availableClasses: AvailableBaseClass[];
}

export function ClassSelectionField<T extends FieldValues>({
    form,
    name,
    availableClasses,
}: ClassSelectionFieldProps<T>) {
    const handleSelectAll = () => {
        const allClassIds: string[] = availableClasses.map((c) => c.classId);
        // Type assertion needed: React Hook Form can't infer that FieldPath<T> points to string[]
        // This is safe because we know classIds is always string[] in our schemas
        form.setValue(name, allClassIds as PathValue<T, FieldPath<T>>, {
            shouldValidate: true,
        });
    };

    const handleSelectNone = () => {
        // Type assertion needed: React Hook Form can't infer that FieldPath<T> points to string[]
        // This is safe because we know classIds is always string[] in our schemas
        form.setValue(name, [] as PathValue<T, FieldPath<T>>, {
            shouldValidate: true,
        });
    };

    return (
        <Field>
            <div className="flex items-center justify-between">
                <FieldLabel>Classes</FieldLabel>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                    >
                        Select All
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectNone}
                    >
                        Select None
                    </Button>
                </div>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-4">
                {availableClasses.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        No available classes
                    </p>
                ) : (
                    availableClasses.map((baseClass) => (
                        <Controller
                            key={baseClass.classId}
                            name={name}
                            control={form.control}
                            render={({ field }) => {
                                // Type assertion needed: field.value is unknown, but we know it's string[] for classIds
                                const currentValue: string[] = Array.isArray(
                                    field.value
                                )
                                    ? (field.value as string[])
                                    : [];
                                const isChecked = currentValue.includes(
                                    baseClass.classId
                                );

                                return (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    field.onChange([
                                                        ...currentValue,
                                                        baseClass.classId,
                                                    ]);
                                                } else {
                                                    field.onChange(
                                                        currentValue.filter(
                                                            (id) =>
                                                                id !==
                                                                baseClass.classId
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <label className="flex-1 cursor-pointer text-sm">
                                            {baseClass.shortName} -{" "}
                                            {baseClass.longName}
                                            {baseClass.orgId === null ? (
                                                <span className="text-muted-foreground ml-2 text-xs">
                                                    (Global)
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground ml-2 text-xs">
                                                    (Org)
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                );
                            }}
                        />
                    ))
                )}
            </div>
        </Field>
    );
}
