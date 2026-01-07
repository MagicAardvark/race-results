type ValueDisplayProps = {
    label: string;
    value: string | number;
    size?: "sm" | "md" | "lg";
    className?: string;
};

export function ValueDisplay({
    label,
    value,
    size = "md",
    className = "",
}: ValueDisplayProps) {
    const sizeClasses = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    return (
        <div className={`text-center ${className}`}>
            <div className="text-muted-foreground text-xs">{label}</div>
            <div className={`${sizeClasses[size]} font-bold`}>{value}</div>
        </div>
    );
}
