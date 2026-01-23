import { UpdateBaseClassForm } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/update-base-class-form";
import { NothingToShow } from "@/app/components/shared/nothing-to-show";
import { Stack } from "@/app/components/shared/stack";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { LinkButton } from "@/ui/link-button";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>;
}) {
    const { classId } = await params;

    const baseClass = await classesAdminService.getGlobalBaseClass(classId);

    if (!baseClass) {
        return (
            <NothingToShow
                description="Class Not Found"
                href="/admin/classes"
            />
        );
    }

    return (
        <Stack>
            <div>
                <LinkButton href="/admin/classes">Go Back</LinkButton>
            </div>

            <UpdateBaseClassForm baseClass={baseClass} />
        </Stack>
    );
}
