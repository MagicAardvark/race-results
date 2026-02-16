"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Button } from "@/ui/button";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { ClassGroupsList } from "./class-groups-list";
import { CreateClassGroupDialog } from "./create-class-group-dialog";
import { AvailableBaseClass } from "../types";

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
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Class Groups</h1>
            <p className="text-muted-foreground text-sm">
                Group base classes for event registration and results (e.g.
                &quot;Street&quot;, &quot;PAX&quot;). Assign class groups to
                events so drivers can register. Reordering or deleting a group
                does not change historical results, but removing classes from a
                group can affect future events that use it.
            </p>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-end space-y-0">
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        Add Class Group
                    </Button>
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
        </div>
    );
};
