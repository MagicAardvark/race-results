interface StackProps {
    children: React.ReactNode;
    orientation?: "vertical" | "horizontal";
    gap?: "none" | "small" | "medium" | "large";
    className?: string;
}

const gapClasses: Record<string, string> = {
    none: "gap-0",
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
};

const orientationClasses: Record<string, string> = {
    vertical: "flex-col",
    horizontal: "flex-row",
};

export const Stack = ({
    children,
    orientation = "vertical",
    gap = "medium",
    className = "",
}: StackProps) => {
    return (
        <div
            className={`flex ${orientationClasses[orientation]} ${gapClasses[gap]} ${className}`}
        >
            {children}
        </div>
    );
};
