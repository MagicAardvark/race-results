import { ClassGroupWithClasses } from "@/dto/class-groups";

export type AvailableBaseClass = {
    classId: string;
    shortName: string;
    longName: string;
    orgId: string | null;
};

export type ClassGroupDialogProps = {
    orgId: string;
    availableBaseClasses: AvailableBaseClass[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (group: ClassGroupWithClasses) => void;
};
