"use client";

import { Tenant } from "@/dto/tenants";
import React, { createContext, useContext } from "react";

const TenantContext = createContext<Tenant | null>(null);

export function TenantProvider({
    tenant,
    children,
}: {
    tenant: Tenant;
    children: React.ReactNode;
}) {
    return (
        <TenantContext.Provider value={tenant}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const ctx = useContext(TenantContext);

    if (!ctx) {
        throw new Error("useTenant must be used within a TenantProvider");
    }

    return ctx;
}
