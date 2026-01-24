import { AddBaseClassDialog } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/add-base-class-dialog";
import { BaseClassesList } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/base-classes-list";
import { Stack } from "@/app/components/shared/stack";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";

export default async function Page() {
    const baseClasses = await classesAdminService.getGlobalBaseClasses();

    const classTypes = await classesAdminService.getClassTypes();
    const classCategories = await classesAdminService.getClassCategories();

    return (
        <Stack>
            <div>
                <AddBaseClassDialog
                    classTypes={classTypes}
                    classCategories={classCategories}
                />
            </div>
            <BaseClassesList baseClasses={baseClasses} />
        </Stack>
    );
}
