import { cn } from "@/lib/utils";

type TimeValueProps = {
    label: string;
    value: number | string | null | undefined;
    secondaryLabel?: string;
    secondaryValue?: React.ReactNode;
    className?: string;
    formatValue?: (value: number) => string;
};

export function TimeValue({
    label,
    value,
    secondaryLabel,
    secondaryValue,
    className = "col-span-4",
    formatValue = (v) => v.toFixed(3),
}: TimeValueProps) {
    const displayValue =
        value == null
            ? "N/A"
            : typeof value === "number"
              ? formatValue(value)
              : value;

    return (
        <div className={cn(className, "flex flex-col justify-center items-end")}>
            <div className="space-y-0.5 text-right">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    {label}
                </div>
                <div className="text-lg font-bold leading-none font-mono">
                    {displayValue}
                </div>
                {secondaryLabel && secondaryValue !== undefined && (
                    <>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1.5">
                            {secondaryLabel}
                        </div>
                        <div className="text-sm font-semibold leading-tight font-mono">
                            {secondaryValue}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

