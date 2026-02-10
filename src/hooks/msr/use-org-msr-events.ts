import { useEffect, useState } from "react";

export const useOrgMsrEvents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [msrEvents, setMsrEvents] = useState<{ id: string; name: string }[]>(
        []
    );

    useEffect(() => {
        const fetchData = async () => {
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
    }, []);

    return { msrEvents, isLoading, isError };
};
