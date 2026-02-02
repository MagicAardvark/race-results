"use client";

import { Organization } from "@/dto/organizations";
import { createContext, useContext } from "react";

const TenantContext = createContext<Organization | null>(null);

export function TenantProvider({
    org,
    children,
}: {
    org: Organization;
    children: React.ReactNode;
}) {
    return (
        <TenantContext.Provider value={org}>{children}</TenantContext.Provider>
    );
}

export function useTenant() {
    const ctx = useContext(TenantContext);

    if (!ctx) {
        throw new Error("useTenant must be used within a TenantProvider");
    }

    return ctx;
}
