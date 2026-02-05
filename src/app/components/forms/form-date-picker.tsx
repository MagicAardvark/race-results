import { Calendar } from "@/ui/calendar";
import { Field, FieldLabel, FieldError } from "@/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

function formatDate(date: Date | undefined) {
    if (!date) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

interface FormDatePickerProps<T extends FieldValues> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "name" | "form"
> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
}

export function FormDatePicker<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    ...inputProps
}: FormDatePickerProps<T>) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>();
    const [month, setMonth] = useState<Date | undefined>(date);

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id={name}
                            autoComplete="off"
                            {...field}
                            value={formatDate(field.value)}
                            {...inputProps}
                        />
                        <InputGroupAddon align="inline-end">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <InputGroupButton
                                        id="date-picker"
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label="Select date"
                                    >
                                        <CalendarIcon />
                                        <span className="sr-only">
                                            Select date
                                        </span>
                                    </InputGroupButton>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="end"
                                    alignOffset={-8}
                                    sideOffset={10}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        month={month}
                                        onMonthChange={setMonth}
                                        onSelect={(date) => {
                                            setDate(date);
                                            field.onChange(date);
                                            setOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
