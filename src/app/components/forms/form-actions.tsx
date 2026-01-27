interface FormActionsProps {
    children: React.ReactNode;
    align?: "left" | "right" | "center" | "between";
}

export function FormActions({ children, align = "right" }: FormActionsProps) {
    const alignmentClasses = {
        left: "justify-start",
        right: "justify-end",
        center: "justify-center",
        between: "justify-between",
    };

    return (
        <div className={`flex gap-2 ${alignmentClasses[align]}`}>
            {children}
        </div>
    );
}
