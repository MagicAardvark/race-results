"use client";

import { ClassGroupsManagement } from "./class-groups/class-groups-management";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { AvailableBaseClass } from "./class-groups/_lib/types";

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
