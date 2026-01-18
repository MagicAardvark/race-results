import { classConfigurationRepository } from "@/db/repositories/class-configuration.repo";
import { ConfiguredCarClass } from "@/dto/classing";

interface IClassConfigurationService {
    getClassesForOrg(orgSlug: string): Promise<Map<string, ConfiguredCarClass>>;
}

export class ClassConfigurationService implements IClassConfigurationService {
    async getClassesForOrg(
        orgSlug: string
    ): Promise<Map<string, ConfiguredCarClass>> {
        const classes =
            await classConfigurationRepository.getClassesForOrg(orgSlug);

        const classConfigMap = new Map<string, ConfiguredCarClass>();

        for (const cls of classes) {
            const classDto = {
                classId: cls.classId,
                shortName: cls.shortName,
                longName: cls.longName,
                classGroupId: cls.classGroupId,
                groupShortName: cls.groupShortName,
                groupLongName: cls.groupLongName,
                indexValue: Number.parseFloat(cls.indexValue),
            };

            if (!classConfigMap.has(cls.shortName)) {
                classConfigMap.set(cls.shortName, classDto);
            }
        }

        return classConfigMap;
    }
}

export const classConfigurationService = new ClassConfigurationService();
