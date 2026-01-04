"use client";

import {
    ApiKeyManagementProvider,
    useApiKeyManagementContext,
} from "@/components/admin/organizations/api-key-management/api-key-management-context";
import { CurrentApiKeyDisplay } from "@/components/admin/organizations/api-key-management/current-api-key-display";
import { KeyControlPanel } from "@/components/admin/organizations/api-key-management/key-control-panel";
import { PreviousApiKeysTable } from "@/components/admin/organizations/api-key-management/previous-api-keys-table";
import { Button } from "@/components/library/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/library/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/library/ui/empty";
import { OrganizationExtended } from "@/dto/organizations";
import { RefreshCw, TriangleAlert } from "lucide-react";

const NoApiKeys = () => {
    const { handleUpdateApiKey, isPending } = useApiKeyManagementContext();

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <TriangleAlert />
                </EmptyMedia>
                <EmptyTitle>No API Key History</EmptyTitle>
                <EmptyDescription>
                    No API keys have been created for this organization.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button
                    onClick={async () => {
                        await handleUpdateApiKey({ isEnabled: true });
                    }}
                    disabled={isPending}
                >
                    <RefreshCw className={isPending ? "animate-spin" : ""} />{" "}
                    {isPending ? "Generating..." : "Generate API Key"}
                </Button>
            </EmptyContent>
        </Empty>
    );
};

const ApiKeyList = () => {
    const { org, handleUpdateApiKey, isPending } = useApiKeyManagementContext();

    if (org.orgApiKeys.length === 0) {
        return <div>No API Keys Available</div>;
    }

    const current = org.orgApiKeys[0];
    const rest = org.orgApiKeys.slice(1);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex w-full flex-col gap-2">
                    <CurrentApiKeyDisplay
                        apiKey={current.apiKey}
                        enabled={current.apiKeyEnabled}
                        effectiveAt={current.effectiveAt}
                    />
                </div>
                <KeyControlPanel
                    currentKeyEnabled={current.apiKeyEnabled}
                    onGenerateNew={async () => {
                        await handleUpdateApiKey({ isEnabled: true });
                    }}
                    onDisable={async () => {
                        await handleUpdateApiKey({ isEnabled: false });
                    }}
                    isPending={isPending}
                />
            </div>
            <PreviousApiKeysTable keys={rest} />
        </div>
    );
};

export const ApiKeyManagement = ({ org }: { org: OrganizationExtended }) => {
    return (
        <ApiKeyManagementProvider org={org}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent>
                    {org.orgApiKeys.length === 0 ? (
                        <NoApiKeys />
                    ) : (
                        <ApiKeyList />
                    )}
                </CardContent>
            </Card>
        </ApiKeyManagementProvider>
    );
};
