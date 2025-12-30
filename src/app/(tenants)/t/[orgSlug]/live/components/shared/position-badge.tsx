import { cn } from "@/lib/utils";

type PositionBadgeProps = {
    label: string;
    value: string | number;
    secondaryLabel?: string;
    secondaryValue?: string | number;
    className?: string;
};

export function PositionBadge({
    label,
    value,
    secondaryLabel,
    secondaryValue,
    className = "col-span-2",
}: PositionBadgeProps) {
    return (
        <div className={cn(className, "flex flex-col justify-center")}>
            <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    {label}
                </div>
                <div className="text-xl font-bold leading-none">{value}</div>
                {secondaryLabel && secondaryValue !== undefined && (
                    <>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1.5">
                            {secondaryLabel}
                        </div>
                        <div className="text-sm font-semibold leading-tight">
                            {secondaryValue}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

