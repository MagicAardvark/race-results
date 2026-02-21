"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import type { DriverIdentifier } from "../hooks/useLiveData";

export type DriverLinkFormProps = {
    /** List of event drivers to choose from (e.g. from useLiveData().getAllDrivers()). */
    drivers: DriverIdentifier[];
    /** Currently selected driver id (controlled). */
    selectedDriverId: string | null;
    /** Called when the user changes the selection. */
    onSelect: (driverId: string | null) => void;
    /** Called when the user submits (e.g. "This is me"). Parent should call linkDriverToCurrentUser(selectedDriver.msrId, selectedDriver.name). */
    onLink: () => void;
    /** Whether the link request is in progress. */
    linking: boolean;
    /** Error message to show below the form. */
    error: string | null;
    /** Label for the driver dropdown. */
    selectLabel?: string;
    /** id for the select (for accessibility). */
    selectId?: string;
    /** Label for the submit button. */
    submitLabel?: string;
    /** Label shown while submitting (default "Saving…"). */
    submitLabelLoading?: string;
};

/**
 * Reusable form to link the current user to an event driver: dropdown of drivers
 * plus a submit button. Use on the Me page (initial link and retry) or anywhere
 * the user picks their identity from event results. Parent owns state and
 * calls the link action (e.g. linkDriverToCurrentUser from @/app/actions/user-profile).
 */
export function DriverLinkForm({
    drivers,
    selectedDriverId,
    onSelect,
    onLink,
    linking,
    error,
    selectLabel = "I am this driver",
    selectId = "driver-link-select",
    submitLabel = "This is me",
    submitLabelLoading = "Saving…",
}: DriverLinkFormProps) {
    const selectedDriver = selectedDriverId
        ? (drivers.find((d) => d.id === selectedDriverId) ?? null)
        : null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex-1">
                    <label
                        htmlFor={selectId}
                        className="mb-2 block text-sm font-medium"
                    >
                        {selectLabel}
                    </label>
                    <Select
                        value={selectedDriverId ?? ""}
                        onValueChange={(v) => onSelect(v || null)}
                    >
                        <SelectTrigger
                            id={selectId}
                            className="w-full sm:max-w-md"
                        >
                            <SelectValue placeholder="Choose your name…" />
                        </SelectTrigger>
                        <SelectContent>
                            {drivers.map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name} – {driver.carClass} #
                                    {driver.number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={onLink} disabled={!selectedDriver || linking}>
                    {linking ? submitLabelLoading : submitLabel}
                </Button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
}
