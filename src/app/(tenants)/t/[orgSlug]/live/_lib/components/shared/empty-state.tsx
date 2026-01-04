import { Card, CardContent } from "@/ui/card";

type EmptyStateProps = {
    message?: string;
    children?: React.ReactNode;
};

export function EmptyState({
    message = "No data available",
    children,
}: EmptyStateProps) {
    return (
        <main className="mt-4">
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                        {message}
                    </p>
                    {children}
                </CardContent>
            </Card>
        </main>
    );
}

