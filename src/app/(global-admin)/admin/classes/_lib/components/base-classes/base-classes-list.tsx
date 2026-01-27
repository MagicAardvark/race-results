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
import { CalculatorIcon, Eye, EyeOff, PencilIcon } from "lucide-react";
import { CgStopwatch } from "react-icons/cg";

type BaseClassesListProps = {
    baseClasses: BaseCarClass[];
};

export const BaseClassesList = ({ baseClasses }: BaseClassesListProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1">Type</TableHead>
                    <TableHead className="w-1">Category</TableHead>
                    <TableHead className="w-1">Short Name</TableHead>
                    <TableHead>Long Name</TableHead>
                    <TableHead className="w-1 text-center"></TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {baseClasses.map((bc) => (
                    <TableRow key={bc.classId}>
                        <TableCell className="w-1">
                            {bc.classType?.shortName}
                        </TableCell>
                        <TableCell className="w-1">
                            {bc.classCategory?.longName}
                        </TableCell>
                        <TableCell className="w-1">{bc.shortName}</TableCell>
                        <TableCell>{bc.longName}</TableCell>
                        <TableCell className="w-1 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                                {bc.isIndexed ? (
                                    <TooltipIcon
                                        icon={<CalculatorIcon size={16} />}
                                        text="Indexed"
                                    />
                                ) : (
                                    <TooltipIcon
                                        icon={<CgStopwatch size={16} />}
                                        text="Raw Time"
                                    />
                                )}
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
