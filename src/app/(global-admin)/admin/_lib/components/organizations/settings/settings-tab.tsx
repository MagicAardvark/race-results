"use client";

import { FeatureFlagsManagement } from "./feature-flags-management";
import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";
import { ApiKeyManagement } from "@/app/(global-admin)/admin/_lib/components/organizations/api-key-management/api-key-management";

interface SettingsTabProps {
    org: OrganizationExtended;
    featureFlags: OrgFeatureFlags;
}

export const SettingsTab = ({ org, featureFlags }: SettingsTabProps) => {
    return (
        <div className="space-y-4">
            <ApiKeyManagement org={org} />
            <FeatureFlagsManagement org={org} featureFlags={featureFlags} />
        </div>
    );
};
