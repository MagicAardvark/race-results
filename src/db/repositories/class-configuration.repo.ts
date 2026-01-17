import { db } from "@/db";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import { ClassesWithEffectiveIndexValueDTO } from "@/dto/classing";

interface IClassConfigurationRepository {
    getClassesForOrg(
        orgSlug: string
    ): Promise<ClassesWithEffectiveIndexValueDTO[]>;
}

export class ClassConfigurationRepository implements IClassConfigurationRepository {
    async getClassesForOrg(
        orgSlug: string
    ): Promise<ClassesWithEffectiveIndexValueDTO[]> {
        const org = await organizationsRepository.findBySlug(orgSlug);

        if (!org) {
            throw new Error(`Organization with slug ${orgSlug} not found`);
        }

        const classes = await db.query.classesWithEffectiveIndexValues.findMany(
            {
                where: {
                    OR: [
                        { orgId: { isNull: true } },
                        {
                            orgId: org.orgId,
                        },
                    ],
                },
            }
        );

        return classes;
    }
}

export const classConfigurationRepository = new ClassConfigurationRepository();
