import { updateApiKey } from "@/app/actions/organization.actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function useApiKeyActions(orgId: string) {
    const [isPending, startTransition] = useTransition();

    const handleUpdateApiKey = async (options: { isEnabled: boolean }) => {
        return new Promise<void>((resolve, reject) => {
            startTransition(async () => {
                try {
                    await updateApiKey(orgId, options);
                    toast.success(
                        options.isEnabled
                            ? "API Key Generated"
                            : "API Access Disabled",
                        {
                            description: options.isEnabled
                                ? "A new API key has been created and is now active."
                                : "API access has been disabled for this organization.",
                        }
                    );
                    resolve();
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "An unknown error occurred";
                    toast.error("Failed to create API Key", {
                        duration: 4000,
                        description: message,
                    });
                    reject(error);
                }
            });
        });
    };

    return { handleUpdateApiKey, isPending };
}
