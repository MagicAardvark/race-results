import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatWithDateAndTime } from "@/lib/date-format";
import { CircleCheck, Copy, CopyCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

interface CurrentApiKeyDisplayProps {
    apiKey: string;
    enabled: boolean;
    effectiveAt: Date;
}

export const CurrentApiKeyDisplay = ({
    apiKey,
    enabled,
    effectiveAt,
}: CurrentApiKeyDisplayProps) => {
    const { copy, copyStatus } = useCopyToClipboard();

    if (!enabled) {
        return (
            <p className="flex w-max items-center gap-2 rounded-md bg-red-50 p-2">
                <TriangleAlert className="text-red-700" size={14} />
                API Access is disabled, effective{" "}
                {formatWithDateAndTime(effectiveAt)}
            </p>
        );
    }

    return (
        <>
            <h3 className="font-semibold">Current API Key</h3>
            <p className="mb-2 flex w-max items-center gap-2 rounded-md bg-green-50 p-2">
                <CircleCheck size={15} className="text-green-700" /> API Access
                is enabled, effective {formatWithDateAndTime(effectiveAt)}
            </p>
            <InputGroup className="max-w-110">
                <InputGroupInput
                    readOnly
                    value={apiKey}
                    className="font-mono"
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        onClick={() => {
                            copy(apiKey);
                            toast.success("API Key copied to clipboard", {
                                duration: 2000,
                            });
                        }}
                        aria-label="Copy API Key"
                    >
                        {copyStatus === "copied" ? (
                            <CopyCheck className="text-green-700" />
                        ) : (
                            <Copy />
                        )}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </>
    );
};
