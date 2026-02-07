"use client";

import { AvailableBaseClass } from "@/app/(global-admin)/admin/_lib/components/organizations/class-groups/_lib/types";
import { ClassGroupsManagement } from "@/app/(global-admin)/admin/_lib/components/organizations/class-groups/class-groups-management";
import { ClassGroupWithClasses } from "@/dto/class-groups";

interface EventSetupTabProps {
    orgId: string;
    initialClassGroups: ClassGroupWithClasses[];
    availableBaseClasses: AvailableBaseClass[];
}

export const EventSetupTab = ({
    orgId,
    initialClassGroups,
    availableBaseClasses,
}: EventSetupTabProps) => {
    return (
        <div className="space-y-4">
            <ClassGroupsManagement
                orgId={orgId}
                initialClassGroups={initialClassGroups}
                availableBaseClasses={availableBaseClasses}
            />
        </div>
    );
};
