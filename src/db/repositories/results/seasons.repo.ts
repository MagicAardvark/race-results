import { db, seasons } from "@/db";
import { CreateSeasonDTO, SeasonDTO } from "@/dto/events/seasons";
import { generateSlug } from "@/lib/generate-slug";
import { eq } from "drizzle-orm";

interface ISeasonsRepository {
    getSeasonsForOrg(orgId: string): Promise<SeasonDTO[]>;
    create(dto: CreateSeasonDTO): Promise<SeasonDTO>;
    update(seasonId: string, dto: Partial<CreateSeasonDTO>): Promise<SeasonDTO>;
    delete(seasonId: string): Promise<void>;
}

export class SeasonsRepository implements ISeasonsRepository {
    async getSeasonsForOrg(orgId: string): Promise<SeasonDTO[]> {
        const seasons = await db.query.seasons.findMany({
            where: {
                orgId: orgId,
                deletedAt: {
                    isNull: true,
                },
            },
            orderBy: {
                startAt: "desc",
            },
        });

        return seasons;
    }

    async create(dto: CreateSeasonDTO): Promise<SeasonDTO> {
        const [season] = await db
            .insert(seasons)
            .values({
                orgId: dto.orgId,
                name: dto.name,
                slug: generateSlug(dto.name),
                startAt: dto.startAt,
                endAt: dto.endAt,
            })
            .returning();

        return season;
    }

    async update(
        seasonId: string,
        dto: Partial<CreateSeasonDTO>
    ): Promise<SeasonDTO> {
        const [season] = await db
            .update(seasons)
            .set(dto)
            .where(eq(seasons.seasonId, seasonId))
            .returning();
        return season;
    }

    async delete(seasonId: string): Promise<void> {
        await db
            .update(seasons)
            .set({ deletedAt: new Date() })
            .where(eq(seasons.seasonId, seasonId));
    }
}

export const seasonsRepository = new SeasonsRepository();
