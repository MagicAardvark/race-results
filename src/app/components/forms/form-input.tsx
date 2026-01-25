import { Field, FieldLabel, FieldError } from "@/ui/field";
import { Input } from "@/ui/input";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "name" | "form"
> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
}

export function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    type = "text",
    ...inputProps
}: FormInputProps<T>) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        autoComplete="off"
                        {...field}
                        {...inputProps}
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
