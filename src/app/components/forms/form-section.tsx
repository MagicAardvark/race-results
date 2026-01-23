import { ReactNode } from "react";

interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({
    title,
    description,
    children,
}: FormSectionProps) {
    return (
        <div className="space-y-4">
            {(title || description) && (
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-base font-semibold">{title}</h3>
                    )}
                    {description && (
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
}
