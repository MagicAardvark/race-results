import { seasonsRepository } from "@/db/repositories/results/seasons.repo";
import { CreateSeasonData, Season, SeasonDTO } from "@/dto/events/seasons";
import { generateSlug } from "@/lib/generate-slug";

interface ISeasonsService {
    getSeasonsForOrg(orgId: string): Promise<Season[]>;
    create(dto: CreateSeasonData): Promise<Season>;
}

export class SeasonsService implements ISeasonsService {
    async getSeasonsForOrg(orgId: string): Promise<Season[]> {
        const dtos = await seasonsRepository.getSeasonsForOrg(orgId);
        return this.mapSeasons(dtos);
    }

    async create(dto: CreateSeasonData): Promise<Season> {
        const season = await seasonsRepository.create({
            ...dto,
            slug: generateSlug(dto.name),
            startDate: dto.startDate,
            endDate: dto.endDate,
        });

        return this.mapSeason(season);
    }

    private mapSeasons(dtos: SeasonDTO[]): Season[] {
        return dtos
            .map((dto) => this.mapSeason(dto))
            .sort((a, b) => {
                // Sort by isCurrent first (current season first)
                if (a.isCurrent && !b.isCurrent) return -1;
                if (!a.isCurrent && b.isCurrent) return 1;
                // Then sort by date
                return (
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                );
            });
    }

    private mapSeason(dto: SeasonDTO): Season {
        const today = new Date();
        return {
            seasonId: dto.seasonId,
            orgId: dto.orgId,
            name: dto.name,
            slug: dto.slug,
            startDate: dto.startDate,
            endDate: dto.endDate,
            isCurrent:
                new Date(dto.startDate) <= today &&
                new Date(dto.endDate) >= today,
        };
    }
}

export const seasonsService = new SeasonsService();
