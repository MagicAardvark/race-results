"use client";

import { AddIndexValueDialog } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/add-index-value-dialog";
import { EditIndexValueDialog } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/edit-index-value";
import { Stack } from "@/app/components/shared/stack";
import { TooltipIcon } from "@/app/components/shared/tooltip-icon";
import { BaseCarClass } from "@/dto/classes-admin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { CheckCircle } from "lucide-react";

interface IndexConfigurationProps {
    baseClass: BaseCarClass;
}

export const IndexConfiguration = ({ baseClass }: IndexConfigurationProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <Stack>
            <div>
                Historical index values for{" "}
                <strong>{baseClass.shortName}</strong>.
            </div>
            <div>
                <AddIndexValueDialog
                    classId={baseClass.classId}
                    className={baseClass.shortName}
                    existingYears={baseClass.indexValues.map((iv) => iv.year)}
                />
            </div>
            <Table className="w-full md:max-w-[500px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="w-1">Value</TableHead>
                        <TableHead className="w-1"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {baseClass.indexValues.map((iv) => (
                        <TableRow key={iv.indexValueId}>
                            <TableCell>
                                <div className="flex h-full items-center gap-2">
                                    <div>{iv.year}</div>
                                    <div>
                                        {iv.year === currentYear && (
                                            <TooltipIcon
                                                icon={
                                                    <CheckCircle
                                                        size={16}
                                                        className="text-green-500"
                                                    />
                                                }
                                                text="Active Value"
                                            />
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="w-1">
                                {iv.value.toFixed(3)}
                            </TableCell>
                            <TableCell className="w-1">
                                <EditIndexValueDialog
                                    className={baseClass.shortName}
                                    indexValueId={iv.indexValueId}
                                    value={iv.value}
                                    year={iv.year}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
};
