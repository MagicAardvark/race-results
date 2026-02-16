import { AddBaseClassDialog } from "@/app/(global-admin)/admin/(global)/classes/_lib/components/base-classes/add-base-class-dialog";
import { BaseClassesList } from "@/app/(global-admin)/admin/(global)/classes/_lib/components/base-classes/base-classes-list";
import { EditBaseClassDialog } from "@/app/(global-admin)/admin/(global)/classes/_lib/components/base-classes/edit-base-class-dialog";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ edit?: string }>;
}) {
    const { edit: editClassId } = await searchParams;

    const [baseClasses, classTypes, classCategories, editingBaseClass] =
        await Promise.all([
            classesAdminService.getGlobalBaseClasses(),
            classesAdminService.getClassTypes(),
            classesAdminService.getClassCategories(),
            editClassId
                ? classesAdminService.getGlobalBaseClass(editClassId)
                : Promise.resolve(null),
        ]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Base Classes</h1>
            <p className="text-muted-foreground text-sm">
                Define the class types used across all organizations (e.g. PAX,
                Street, CAM). Choose indexed (multiplier) or raw time. Base
                classes are global. Disabling a class hides it from new
                assignments but does not remove it from existing data.
            </p>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-end space-y-0">
                    <AddBaseClassDialog
                        classTypes={classTypes}
                        classCategories={classCategories}
                    />
                </CardHeader>
                <CardContent>
                    <BaseClassesList baseClasses={baseClasses} />
                </CardContent>
            </Card>
            <EditBaseClassDialog
                editingBaseClass={editingBaseClass}
                classTypes={classTypes}
                classCategories={classCategories}
            />
        </div>
    );
}
