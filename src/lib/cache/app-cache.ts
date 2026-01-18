interface CacheItem<T> {
    value: T;
    expires: number;
}

class ApplicationCache {
    private cache = new Map<string, CacheItem<unknown>>();

    set<T>(key: string, value: T, ttlSeconds: number = 3600): void {
        this.cache.set(key, {
            value,
            expires: Date.now() + ttlSeconds * 1000,
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) return null;

        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }

        return item.value as T;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }
}

// Use globalThis to persist cache across hot reloads in development
const globalForCache = globalThis as unknown as {
    appCache: ApplicationCache | undefined;
};

export const appCache = globalForCache.appCache ?? new ApplicationCache();

if (process.env.NODE_ENV !== "production") {
    globalForCache.appCache = appCache;
}
