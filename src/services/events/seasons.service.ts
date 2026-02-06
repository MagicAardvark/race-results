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
        const ensureStartOfStartDate = new Date(dto.startAt);
        ensureStartOfStartDate.setHours(0, 0, 0, 0);

        const ensureEndOfEndDate = new Date(dto.endAt);
        ensureEndOfEndDate.setHours(23, 59, 59, 999);

        const season = await seasonsRepository.create({
            ...dto,
            slug: generateSlug(dto.name),
            startAt: ensureStartOfStartDate,
            endAt: ensureEndOfEndDate,
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
                return a.startAt.getTime() - b.startAt.getTime();
            });
    }

    private mapSeason(dto: SeasonDTO): Season {
        return {
            seasonId: dto.seasonId,
            orgId: dto.orgId,
            name: dto.name,
            slug: dto.slug,
            startAt: dto.startAt,
            endAt: dto.endAt,
            isCurrent: dto.startAt <= new Date() && dto.endAt >= new Date(),
        };
    }
}

export const seasonsService = new SeasonsService();
