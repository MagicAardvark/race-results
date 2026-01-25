"use client";

import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/ui/field";
import { Input } from "@/ui/input";
import { toTitleCase, toUpperCase } from "./utils";

interface FormattedInputProps<T extends FieldValues> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<T, any, any>;
    name: FieldPath<T>;
    label: string;
    placeholder: string;
    format: "uppercase" | "titleCase";
}

export function FormattedInput<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    format,
}: FormattedInputProps<T>) {
    const formatValue = format === "uppercase" ? toUpperCase : toTitleCase;

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
                const fieldName = String(name);
                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={fieldName}>{label}</FieldLabel>
                        <Input
                            type="text"
                            id={fieldName}
                            placeholder={placeholder}
                            {...field}
                            onBlur={(e) => {
                                const formatted = formatValue(e.target.value);
                                // Use field.onChange directly to avoid type issues
                                field.onChange(formatted);
                                field.onBlur();
                            }}
                            autoComplete="off"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    );
}
