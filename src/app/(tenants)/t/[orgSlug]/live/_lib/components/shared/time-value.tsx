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
        <div
            className={cn(className, "flex flex-col items-end justify-center")}
        >
            <div className="space-y-0.5 text-right">
                <div className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                    {label}
                </div>
                <div className="font-mono text-lg leading-none font-bold">
                    {displayValue}
                </div>
                {secondaryLabel && secondaryValue !== undefined && (
                    <>
                        <div className="text-muted-foreground mt-1.5 text-[10px] font-medium tracking-wide uppercase">
                            {secondaryLabel}
                        </div>
                        <div className="font-mono text-sm leading-tight font-semibold">
                            {secondaryValue}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
