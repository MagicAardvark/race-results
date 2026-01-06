import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import type { DriverIdentifier } from "../../hooks/useLiveData";

type DriverSelectProps = {
    drivers: DriverIdentifier[];
    selectedDriverId: string | null;
    onDriverChange: (driverId: string) => void;
};

export function DriverSelect({ drivers, selectedDriverId, onDriverChange }: DriverSelectProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Select value={selectedDriverId || ""} onValueChange={onDriverChange}>
                    <SelectTrigger className="w-full sm:max-w-md">
                        <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                        {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} - {driver.carClass} #{driver.number}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

