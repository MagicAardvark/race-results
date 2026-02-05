"use client";

import { useOrganizationData } from "@/app/(global-admin)/admin/organizations/[slug]/_lib/organization-data-context";
import { SettingsTab } from "@/app/(global-admin)/admin/organizations/_lib/components/settings-tab";

export default function OrganizationSettingsPage() {
    const { org, featureFlags } = useOrganizationData();

    return <SettingsTab org={org} featureFlags={featureFlags} />;
}
