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
                <div className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                    {label}
                </div>
                <div className="text-xl leading-none font-bold">{value}</div>
                {secondaryLabel && secondaryValue !== undefined && (
                    <>
                        <div className="text-muted-foreground mt-1.5 text-[10px] font-medium tracking-wide uppercase">
                            {secondaryLabel}
                        </div>
                        <div className="text-sm leading-tight font-semibold">
                            {secondaryValue}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
