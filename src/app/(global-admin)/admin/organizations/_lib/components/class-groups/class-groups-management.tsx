"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button-wrapper";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { ClassGroupsList } from "./class-groups-list";
import { CreateClassGroupDialog } from "./create-class-group-dialog";
import { AvailableBaseClass } from "./_lib/types";

interface ClassGroupsManagementProps {
    orgId: string;
    initialClassGroups: ClassGroupWithClasses[];
    availableBaseClasses: AvailableBaseClass[];
}

export const ClassGroupsManagement = ({
    orgId,
    initialClassGroups,
    availableBaseClasses,
}: ClassGroupsManagementProps) => {
    const [classGroups, setClassGroups] =
        useState<ClassGroupWithClasses[]>(initialClassGroups);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleClassGroupCreated = (newGroup: ClassGroupWithClasses) => {
        setClassGroups([...classGroups, newGroup]);
        setIsCreateDialogOpen(false);
    };

    const handleClassGroupUpdated = (updatedGroup: ClassGroupWithClasses) => {
        setClassGroups(
            classGroups.map((cg) =>
                cg.classGroupId === updatedGroup.classGroupId
                    ? updatedGroup
                    : cg
            )
        );
    };

    const handleClassGroupDeleted = (classGroupId: string) => {
        setClassGroups(
            classGroups.filter((cg) => cg.classGroupId !== classGroupId)
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Class Groups</CardTitle>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        Create Group
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ClassGroupsList
                    orgId={orgId}
                    classGroups={classGroups}
                    availableBaseClasses={availableBaseClasses}
                    onUpdate={handleClassGroupUpdated}
                    onDelete={handleClassGroupDeleted}
                />
                <CreateClassGroupDialog
                    orgId={orgId}
                    availableBaseClasses={availableBaseClasses}
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={handleClassGroupCreated}
                />
            </CardContent>
        </Card>
    );
};
