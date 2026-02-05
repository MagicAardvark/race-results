"use client";

import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "@/app/(global-admin)/admin/organizations/_lib/components/class-groups/_lib/types";
import { EventDTO } from "@/dto/events";
import { createContext, useContext } from "react";

type OrganizationData = {
    org: OrganizationExtended;
    featureFlags: OrgFeatureFlags;
    classGroups: ClassGroupWithClasses[];
    availableBaseClasses: AvailableBaseClass[];
    orgEvents: EventDTO[];
};

const OrganizationDataContext = createContext<OrganizationData | null>(null);

export function OrganizationDataProvider({
    children,
    data,
}: {
    children: React.ReactNode;
    data: OrganizationData;
}) {
    return (
        <OrganizationDataContext.Provider value={data}>
            {children}
        </OrganizationDataContext.Provider>
    );
}

export function useOrganizationData() {
    const context = useContext(OrganizationDataContext);
    if (!context) {
        throw new Error(
            "useOrganizationData must be used within OrganizationDataProvider"
        );
    }
    return context;
}
