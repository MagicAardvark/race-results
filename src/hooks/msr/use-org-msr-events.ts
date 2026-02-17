import { StoredMsrEventDTO } from "@/dto/motorsportreg/stored";
import { useEffect, useState } from "react";

export const useOrgMsrEvents = (isMsrConfigured: boolean) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [msrEvents, setMsrEvents] = useState<StoredMsrEventDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isMsrConfigured) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/msr/events");

                const events = await response.json();

                setMsrEvents(events);
                setIsLoading(false);
            } catch {
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isMsrConfigured]);

    return { msrEvents, isLoading, isError };
};
