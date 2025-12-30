import { Card, CardContent } from "@/components/library/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ResultCardProps = {
    children: ReactNode;
    onClick?: () => void;
    isHighlighted?: boolean;
    className?: string;
};

export function ResultCard({
    children,
    onClick,
    isHighlighted = false,
    className,
}: ResultCardProps) {
    return (
        <Card
            className={cn(
                onClick && "cursor-pointer transition-colors hover:bg-muted/50",
                isHighlighted && "bg-orange-50 dark:bg-orange-950/20",
                className
            )}
            onClick={onClick}
        >
            <CardContent className="px-4 py-0">
                <div className="grid grid-cols-12 gap-4">{children}</div>
            </CardContent>
        </Card>
    );
}

