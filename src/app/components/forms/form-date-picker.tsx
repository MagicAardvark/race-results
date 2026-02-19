"use client";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Field, FieldLabel, FieldError } from "@/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { getDateString } from "@/lib/date-utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
    Controller,
    FieldPath,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";

interface FormDatePickerProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
}

export function FormDatePicker<T extends FieldValues>({
    form,
    name,
    label,
}: FormDatePickerProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
                const selectedDate = new Date(`${field.value}T00:00:00`);

                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name}>{label}</FieldLabel>
                        <Popover
                            open={open}
                            onOpenChange={setOpen}
                            modal={false}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-picker"
                                    variant="outline"
                                    aria-label="Select date"
                                >
                                    <CalendarIcon />
                                    {selectedDate
                                        ? format(selectedDate, "LLLL do, yyyy")
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                alignOffset={-8}
                                sideOffset={10}
                            >
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        const dateString = date
                                            ? getDateString(date)
                                            : undefined;
                                        field.onChange(dateString);
                                        setOpen(false);
                                    }}
                                    defaultMonth={selectedDate}
                                />
                            </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    );
}
