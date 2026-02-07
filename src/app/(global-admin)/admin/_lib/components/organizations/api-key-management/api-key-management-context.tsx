import { OrganizationExtended } from "@/dto/organizations";
import { useApiKeyActions } from "@/hooks/admin/use-api-key-actions";
import { createContext, useContext } from "react";

interface ApiKeyContextValue {
    org: OrganizationExtended;
    handleUpdateApiKey: (options: { isEnabled: boolean }) => Promise<void>;
    isPending: boolean;
}

const ApiKeyManagementContext = createContext<ApiKeyContextValue | null>(null);

export function ApiKeyManagementProvider({
    org,
    children,
}: {
    org: OrganizationExtended;
    children: React.ReactNode;
}) {
    const { handleUpdateApiKey, isPending } = useApiKeyActions(org.orgId);

    return (
        <ApiKeyManagementContext.Provider
            value={{ org, handleUpdateApiKey, isPending }}
        >
            {children}
        </ApiKeyManagementContext.Provider>
    );
}

export function useApiKeyManagementContext() {
    const context = useContext(ApiKeyManagementContext);
    if (!context) {
        throw new Error(
            "useApiKeyManagementContext must be used within ApiKeyManagementProvider"
        );
    }
    return context;
}
