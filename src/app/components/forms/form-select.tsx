import { Field, FieldLabel, FieldError } from "@/ui/field";
import {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Select,
} from "@/ui/select";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    items: { value: string | number; label: string; disabled?: boolean }[];
}

export function FormSelect<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    items,
}: FormSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
                const stringValue = field.value.toString();
                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name}>{label}</FieldLabel>
                        <Select
                            name={name}
                            value={stringValue}
                            onValueChange={(value) => {
                                // If the original value was a number, parse it back
                                if (typeof field.value === "number") {
                                    field.onChange(Number(value));
                                } else {
                                    field.onChange(value);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((item) => {
                                    const itemStringValue =
                                        item.value.toString();
                                    return (
                                        <SelectItem
                                            key={item.value}
                                            value={itemStringValue}
                                            disabled={item.disabled}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    );
}
