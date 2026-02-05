"use client";

import { useOrganizationData } from "@/app/(global-admin)/admin/organizations/[slug]/_lib/organization-data-context";
import { GeneralTab } from "@/app/(global-admin)/admin/organizations/_lib/components/general-tab";

export default function OrganizationGeneralPage() {
    const { org } = useOrganizationData();

    return <GeneralTab org={org} />;
}
