import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from "@/ui/field";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { ReactNode } from "react";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormRadioGroupProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    groupLabel: string | ReactNode;
    groupDescription?: string | ReactNode;
    options: {
        title: string;
        description?: string;
        value: string | number | boolean;
    }[];
}

export function FormRadioGroup<T extends FieldValues>({
    form,
    name,
    groupLabel,
    groupDescription,
    options,
}: FormRadioGroupProps<T>) {
    return (
        <FieldGroup>
            <Controller
                name={name}
                control={form.control}
                render={({ field, fieldState }) => {
                    const stringValue = field.value.toString();

                    return (
                        <FieldSet data-invalid={fieldState.invalid}>
                            <FieldLegend>{groupLabel}</FieldLegend>
                            {groupDescription && (
                                <FieldDescription>
                                    {groupDescription}
                                </FieldDescription>
                            )}
                            <RadioGroup
                                name={field.name}
                                value={stringValue}
                                onValueChange={(value) => {
                                    // Convert back to boolean if original was boolean
                                    if (typeof field.value === "boolean") {
                                        field.onChange(value === "true");
                                    } else {
                                        field.onChange(value);
                                    }
                                }}
                                aria-invalid={fieldState.invalid}
                            >
                                {options.map((option) => {
                                    const optionStringValue =
                                        option.value.toString();

                                    return (
                                        <FieldLabel
                                            key={optionStringValue}
                                            htmlFor={`form-radiogroup-${optionStringValue}`}
                                            className="cursor-pointer hover:brightness-90"
                                        >
                                            <Field
                                                orientation="horizontal"
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldContent>
                                                    <FieldTitle>
                                                        {option.title}
                                                    </FieldTitle>
                                                    {option.description && (
                                                        <FieldDescription>
                                                            {option.description}
                                                        </FieldDescription>
                                                    )}
                                                </FieldContent>
                                                <RadioGroupItem
                                                    value={optionStringValue}
                                                    id={`form-radiogroup-${optionStringValue}`}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                />
                                            </Field>
                                        </FieldLabel>
                                    );
                                })}
                            </RadioGroup>
                        </FieldSet>
                    );
                }}
            />
        </FieldGroup>
    );
}
