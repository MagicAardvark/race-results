import { Checkbox } from "@/ui/checkbox";
import {
    Field,
    FieldLabel,
    FieldError,
    FieldDescription,
    FieldSet,
} from "@/ui/field";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<T, any, any>;
    name: FieldPath<T>;
    label: string;
    description?: string;
}

export function FormCheckbox<T extends FieldValues>({
    form,
    name,
    label,
    description,
}: FormCheckboxProps<T>) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <FieldSet>
                    {description && (
                        <FieldDescription className="block">
                            {description}
                        </FieldDescription>
                    )}
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
                </FieldSet>
            )}
        />
    );
}
