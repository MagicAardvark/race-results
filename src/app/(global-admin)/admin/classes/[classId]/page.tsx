import { IndexConfiguration } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/index-configuration";
import { UpdateBaseClassForm } from "@/app/(global-admin)/admin/classes/_lib/components/base-classes/update-base-class-form";
import { NothingToShow } from "@/app/components/shared/nothing-to-show";
import { Stack } from "@/app/components/shared/stack";
import { classesAdminService } from "@/services/classes-admin/classes-admin.service";
import { LinkButton } from "@/ui/link-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>;
}) {
    const { classId } = await params;

    const baseClass = await classesAdminService.getGlobalBaseClass(classId);
    const classTypes = await classesAdminService.getClassTypes();
    const classCategories = await classesAdminService.getClassCategories();

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

            <Tabs defaultValue="general" className="w-full">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger
                        value="IndexConfiguration"
                        disabled={!baseClass.isIndexed}
                    >
                        Index Value
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <UpdateBaseClassForm
                        baseClass={baseClass}
                        classTypes={classTypes}
                        classCategories={classCategories}
                    />
                </TabsContent>
                <TabsContent value="IndexConfiguration">
                    <IndexConfiguration baseClass={baseClass} />
                </TabsContent>
            </Tabs>
        </Stack>
    );
}
