/**
 * Generic API client for live timing endpoints
 */
type FetchOptions = {
    cache?: RequestCache;
    next?: { revalidate?: number };
};

export async function fetchJson<T>(
    url: string,
    options: FetchOptions = { cache: "no-store" }
): Promise<T | null> {
    try {
        const res = await fetch(url, {
            cache: options.cache,
            next: options.next,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data as T;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

