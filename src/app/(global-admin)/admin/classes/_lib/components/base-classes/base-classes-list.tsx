import { TooltipIcon } from "@/app/components/shared/tooltip-icon";
import { BaseCarClass } from "@/dto/classes-admin";
import { LinkButton } from "@/ui/link-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { Eye, EyeOff, PencilIcon } from "lucide-react";

type BaseClassesListProps = {
    baseClasses: BaseCarClass[];
};

export const BaseClassesList = ({ baseClasses }: BaseClassesListProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Long Name</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {baseClasses.map((bc) => (
                    <TableRow key={bc.classId}>
                        <TableCell className="w-0 whitespace-nowrap">
                            {bc.shortName}
                        </TableCell>
                        <TableCell>{bc.longName}</TableCell>
                        <TableCell className="w-24 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                                {bc.isEnabled ? (
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
                            <LinkButton
                                variant="outline"
                                href={`/admin/classes/${bc.classId}`}
                            >
                                <PencilIcon />
                            </LinkButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
