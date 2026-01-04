import { cn } from "@/lib/utils";

type StatItem = {
    label: string;
    value: string | number;
};

type StatsGridProps = {
    stats: StatItem[];
    columns?: 2 | 3 | 4;
    className?: string;
};

const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
};

export function StatsGrid({
    stats,
    columns = 3,
    className,
}: StatsGridProps) {
    return (
        <div
            className={cn(
                "grid gap-2 rounded-md bg-muted p-2",
                columnClasses[columns],
                className
            )}
        >
            {stats.map((stat, index) => (
                <div key={index} className="text-center text-xs">
                    <div className="font-medium">{stat.label}</div>
                    <div>{stat.value}</div>
                </div>
            ))}
        </div>
    );
}

