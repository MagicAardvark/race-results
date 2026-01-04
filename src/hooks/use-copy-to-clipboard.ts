import { useState } from "react";

type ClipboardStatus = "default" | "copied";

export interface UseCopyToClipboardOptions {
    resetDelay?: number;
}

export interface UseCopyToClipboardResult {
    copyStatus: ClipboardStatus;
    copy: (text: string) => void;
}

export const useCopyToClipboard = (
    options: UseCopyToClipboardOptions = {
        resetDelay: 3000,
    }
): UseCopyToClipboardResult => {
    const [copyStatus, setCopyStatus] = useState<ClipboardStatus>("default");

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus("copied");
            setTimeout(() => setCopyStatus("default"), options.resetDelay);
        });
    };

    return { copyStatus, copy };
};
