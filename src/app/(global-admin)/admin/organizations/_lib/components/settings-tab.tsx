"use client";

import { ApiKeyManagement } from "./api-key-management/api-key-management";
import { FeatureFlagsManagement } from "./feature-flags-management";
import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";

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
