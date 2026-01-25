import { prependEnvironment } from "@/lib/cache/lib";
import { CacheError } from "@/lib/errors/app-errors";
import { Redis } from "@upstash/redis";

class ApplicationCache {
    private cache: Redis;
    private env: string;

    constructor(env: string | undefined) {
        this.env = env || "development";

        this.cache = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds: number = 3600
    ): Promise<void> {
        try {
            await this.cache.set(prependEnvironment(this.env, key), value, {
                ex: ttlSeconds,
            });
        } catch (error) {
            throw new CacheError(
                `Failed to set cache for key ${key}: ${error}`
            );
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            return await this.cache.get(prependEnvironment(this.env, key));
        } catch (error) {
            // Log error to console for now, should be replaced with proper logging
            // eslint-disable-next-line no-console
            console.log("Cache get error:", error);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.cache.del(prependEnvironment(this.env, key));
        } catch (error) {
            throw new CacheError(
                `Failed to delete cache for key ${key}: ${error}`
            );
        }
    }
}

export const appCache = new ApplicationCache(process.env.CACHE_ENV);
