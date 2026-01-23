import { Stack } from "@/app/components/shared/stack";
import { TriangleAlert } from "lucide-react";

interface FormErrorProps {
    isError: boolean;
    messages: string[] | string | undefined;
}

export const FormError = ({ isError, messages }: FormErrorProps) => {
    if (!isError) {
        return null;
    }

    return (
        <Stack className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            <h3 className="flex items-center gap-2 text-base font-medium">
                <TriangleAlert size={20} /> Error
            </h3>
            <div>
                {Array.isArray(messages) ? (
                    <ul className="list-inside list-disc">
                        {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                ) : (
                    messages
                )}
            </div>
        </Stack>
    );
};
