import { Field, FieldLabel, FieldError } from "@/ui/field";
import { Input } from "@/ui/input";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
}

export function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
}: FormInputProps<T>) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input
                        type="text"
                        id={name}
                        placeholder={placeholder}
                        {...field}
                        autoComplete="off"
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
