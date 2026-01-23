import { Checkbox } from "@/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/ui/field";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
}

export function FormCheckbox<T extends FieldValues>({
    form,
    name,
    label,
}: FormCheckboxProps<T>) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                >
                    <Checkbox
                        name={name}
                        id={name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
