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
import { Button } from "@/ui/button-wrapper";
import { PencilIcon, TrashIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { EditClassGroupDialog } from "./edit-class-group-dialog";
import { deleteClassGroup } from "@/app/(global-admin)/admin/organizations/_lib/actions/class-groups";
import { toast } from "sonner";
import { TooltipIcon } from "@/app/components/shared/tooltip-icon";
import { AvailableBaseClass } from "./_lib/types";

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
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

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
            <div className="text-muted-foreground py-8 text-center">
                No class groups found. Create one to get started.
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Short Name</TableHead>
                        <TableHead>Long Name</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead className="w-1 text-center">
                            Status
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classGroups.map((group) => (
                        <TableRow key={group.classGroupId}>
                            <TableCell className="font-medium">
                                {group.shortName}
                            </TableCell>
                            <TableCell>{group.longName}</TableCell>
                            <TableCell>
                                {group.classIds.length === 0 ? (
                                    <span className="text-muted-foreground">
                                        No classes
                                    </span>
                                ) : (
                                    <span className="text-sm">
                                        {group.classIds.length} class
                                        {group.classIds.length !== 1
                                            ? "es"
                                            : ""}
                                    </span>
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
                            <TableCell className="w-0 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Edit ${group.shortName}`}
                                        onClick={() =>
                                            setEditingGroupId(
                                                group.classGroupId
                                            )
                                        }
                                    >
                                        <PencilIcon size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label={`Delete ${group.shortName}`}
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
            {editingGroupId && (
                <EditClassGroupDialog
                    orgId={orgId}
                    classGroupId={editingGroupId}
                    availableBaseClasses={availableBaseClasses}
                    open={editingGroupId !== null}
                    onOpenChange={(open) => !open && setEditingGroupId(null)}
                    onSuccess={(updated) => {
                        onUpdate(updated);
                        setEditingGroupId(null);
                    }}
                />
            )}
        </>
    );
};
