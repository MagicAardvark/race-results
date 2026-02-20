"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { ClassGroupWithClasses } from "@/dto/class-groups";
import { Button } from "@/ui/button";
import { PencilIcon, TrashIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { EditClassGroupDialog } from "./edit-class-group-dialog";
import { deleteClassGroup } from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/actions/class-groups";
import { toast } from "sonner";
import { TooltipIcon } from "@/app/components/shared/tooltip-icon";
import { AvailableBaseClass } from "../types";

interface ClassGroupsListProps {
    orgId: string;
    classGroups: ClassGroupWithClasses[];
    availableBaseClasses: AvailableBaseClass[];
    onUpdate: (group: ClassGroupWithClasses) => void;
    onDelete: (classGroupId: string) => void;
}

export const ClassGroupsList = ({
    orgId,
    classGroups,
    availableBaseClasses,
    onUpdate,
    onDelete,
}: ClassGroupsListProps) => {
    const [editingGroup, setEditingGroup] =
        useState<ClassGroupWithClasses | null>(null);

    const handleDelete = async (classGroupId: string) => {
        if (!confirm("Are you sure you want to delete this class group?")) {
            return;
        }

        const result = await deleteClassGroup(orgId, classGroupId);

        if (result.isError) {
            toast.error(result.errors?.[0] || "Failed to delete class group");
            return;
        }

        toast.success(result.message);
        onDelete(classGroupId);
    };

    if (classGroups.length === 0) {
        return (
            <div className="text-muted-foreground py-6 text-center text-sm">
                No class groups yet. Add one to get started.
            </div>
        );
    }

    const classMap = new Map(availableBaseClasses.map((c) => [c.classId, c]));

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1">Short Name</TableHead>
                        <TableHead className="w-1">Long Name</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead className="w-1 text-center">
                            Status
                        </TableHead>
                        <TableHead className="w-1 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classGroups.map((group) => (
                        <TableRow key={group.classGroupId}>
                            <TableCell className="w-1 font-medium">
                                {group.shortName}
                            </TableCell>
                            <TableCell className="w-1">
                                {group.longName}
                            </TableCell>
                            <TableCell>
                                {group.classIds.length === 0 && (
                                    <span className="text-muted-foreground">
                                        No classes
                                    </span>
                                )}

                                {group.classIds.length ===
                                    availableBaseClasses.length && (
                                    <span className="text-sm">All classes</span>
                                )}

                                {group.classIds.length > 0 &&
                                    group.classIds.length <
                                        availableBaseClasses.length && (
                                        <>
                                            <span className="text-sm">
                                                {group.classIds
                                                    .slice(0, 6)
                                                    .map(
                                                        (id) =>
                                                            classMap.get(id)
                                                                ?.shortName
                                                    )
                                                    .join(", ")}
                                            </span>
                                            {group.classIds.length >= 6 && (
                                                <span className="text-sm">
                                                    {" "}
                                                    plus{" "}
                                                    {group.classIds.length -
                                                        6}{" "}
                                                    more
                                                </span>
                                            )}
                                        </>
                                    )}
                            </TableCell>
                            <TableCell className="w-1 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center">
                                    {group.isEnabled ? (
                                        <TooltipIcon
                                            icon={<Eye size={16} />}
                                            text="Enabled"
                                        />
                                    ) : (
                                        <TooltipIcon
                                            icon={<EyeOff size={16} />}
                                            text="Disabled"
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="w-0 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Edit ${group.shortName}`}
                                        title={`Edit ${group.shortName}`}
                                        onClick={() => setEditingGroup(group)}
                                    >
                                        <PencilIcon size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Delete ${group.shortName}`}
                                        title={`Delete ${group.shortName}`}
                                        onClick={() =>
                                            handleDelete(group.classGroupId)
                                        }
                                    >
                                        <TrashIcon size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingGroup && (
                <EditClassGroupDialog
                    orgId={orgId}
                    classGroup={editingGroup}
                    availableBaseClasses={availableBaseClasses}
                    open
                    onOpenChange={(open) => !open && setEditingGroup(null)}
                    onSuccess={(updated) => {
                        onUpdate(updated);
                        setEditingGroup(null);
                    }}
                />
            )}
        </>
    );
};
