import { useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "selected-driver-id";

type Driver = {
    id: string;
};

/**
 * Hook for managing driver selection with localStorage persistence
 */
export function useDriverSelection(drivers: Driver[]) {
    // Lazy initialization: only read from localStorage once on mount
    const [userSelectedDriverId, setUserSelectedDriverId] = useState<
        string | null
    >(() => {
        if (typeof window === "undefined" || drivers.length === 0) return null;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && drivers.some((d) => d.id === stored)) {
            return stored;
        }
        return null;
    });

    // Save to localStorage when user selection changes
    useEffect(() => {
        if (userSelectedDriverId && typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, userSelectedDriverId);
        }
    }, [userSelectedDriverId]);

    const selectedDriver = useMemo(
        () => drivers.find((d) => d.id === userSelectedDriverId) ?? null,
        [drivers, userSelectedDriverId]
    );

    return {
        selectedDriverId: userSelectedDriverId,
        selectedDriver,
        setSelectedDriverId: setUserSelectedDriverId,
    };
}
