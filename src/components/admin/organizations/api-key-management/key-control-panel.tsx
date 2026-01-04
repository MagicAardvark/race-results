import { Button } from "@/components/button/button";
import { ConfirmationDialog } from "@/components/confimration-dialog";
import { RefreshCw, ShieldBan } from "lucide-react";

const ConfirmDisableDialog = ({
    handleUpdateApiKey,
    isPending,
}: {
    handleUpdateApiKey: (options: { isEnabled: boolean }) => Promise<void>;
    isPending: boolean;
}) => {
    return (
        <ConfirmationDialog
            triggerButton={
                <Button variant={"destructive"}>
                    <ShieldBan /> Disable Access
                </Button>
            }
            actionButton={
                <Button
                    onClick={async () => {
                        await handleUpdateApiKey({ isEnabled: false });
                    }}
                    disabled={isPending}
                    variant={"destructive"}
                >
                    <ShieldBan /> Disable Access
                </Button>
            }
            title="Disable API Access"
            content="Are you sure you want to disable API access for this organization?"
        />
    );
};

const ConfirmGenerateNewKeyDialog = ({
    handleUpdateApiKey,
    isPending,
}: {
    handleUpdateApiKey: (options: { isEnabled: boolean }) => Promise<void>;
    isPending: boolean;
}) => {
    return (
        <ConfirmationDialog
            triggerButton={
                <Button variant={"destructive"}>
                    <RefreshCw /> Generate New Key
                </Button>
            }
            actionButton={
                <Button
                    onClick={async () => {
                        await handleUpdateApiKey({ isEnabled: true });
                    }}
                    disabled={isPending}
                    variant={"destructive"}
                >
                    <RefreshCw /> Generate New Key
                </Button>
            }
            title="Generate New API Key"
            content="Are you sure you want to generate a new API key? If there is
                    a currently enabled API key, it will no longer work."
        />
    );
};

interface KeyControlPanelProps {
    currentKeyEnabled: boolean;
    onGenerateNew: () => Promise<void>;
    onDisable: () => Promise<void>;
    isPending: boolean;
}

export const KeyControlPanel = ({
    currentKeyEnabled,
    onGenerateNew,
    onDisable,
    isPending,
}: KeyControlPanelProps) => {
    return (
        <>
            <h3 className="font-semibold">Key Control</h3>
            <div className="flex gap-2">
                <div className="rounded-md border bg-red-50 p-2">
                    <p className="mb-2">
                        Generating a new API key will disable the current key.
                    </p>
                    <ConfirmGenerateNewKeyDialog
                        handleUpdateApiKey={onGenerateNew}
                        isPending={isPending}
                    />
                </div>

                {currentKeyEnabled && (
                    <div className="rounded-md border bg-red-50 p-2">
                        <p className="mb-2">
                            Disabling Access will generate a new key with access
                            disabled.
                        </p>
                        <ConfirmDisableDialog
                            handleUpdateApiKey={onDisable}
                            isPending={isPending}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
