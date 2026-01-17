import {
    ClassResultsClass,
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
    ResultsEntry,
} from "@/dto/live-results";
import { LiveResultsSnapshot } from "@/dto/live-results/ingest";
import { appCache } from "@/lib/cache/app-cache";
import { classConfigurationService } from "@/services/class-configuration/class-configuration.service";
import { eventsService } from "@/services/events/events.service";
import { LiveResultsParser } from "@/services/live-results/lib/live-results-parser";
import { getCacheKey } from "@/services/live-results/lib/util";

interface ILiveResultsService {
    processAndUpdateCache(
        orgSlug: string,
        data: LiveResultsSnapshot,
        timestamp: Date
    ): Promise<void>;
    getClassResults(orgSlug: string): ProcessedLiveClassResults | null;
    getIndexedResults(orgSlug: string): ProcessedLiveIndexResults | null;
    getRawResults(orgSlug: string): ProcessedLiveRawResults | null;
}

export class LiveResultsService implements ILiveResultsService {
    async processAndUpdateCache(
        orgSlug: string,
        data: LiveResultsSnapshot,
        timestamp: Date
    ): Promise<void> {
        const eventConfig = await eventsService.getEventConfiguration();
        const classData =
            await classConfigurationService.getClassesForOrg(orgSlug);

        const parser = new LiveResultsParser(classData, eventConfig, data);

        const { classResults, indexedResults, rawResults } =
            await parser.buildResults();

        this.updateCache(
            orgSlug,
            timestamp,
            classResults,
            indexedResults,
            rawResults
        );
    }

    getClassResults(orgSlug: string): ProcessedLiveClassResults | null {
        const cached = appCache.get<ProcessedLiveClassResults>(
            getCacheKey(orgSlug, "classResults")
        );

        return cached || null;
    }

    getIndexedResults(orgSlug: string): ProcessedLiveIndexResults | null {
        const cached = appCache.get<ProcessedLiveIndexResults>(
            getCacheKey(orgSlug, "indexedResults")
        );

        return cached || null;
    }

    getRawResults(orgSlug: string): ProcessedLiveRawResults | null {
        const cached = appCache.get<ProcessedLiveRawResults>(
            getCacheKey(orgSlug, "rawResults")
        );

        return cached || null;
    }

    private updateCache(
        orgSlug: string,
        timestamp: Date,
        classResults: ClassResultsClass[],
        indexedResults: ResultsEntry[],
        rawResults: ResultsEntry[]
    ) {
        const expiration = 60 * 60 * 24; // 24 hours

        appCache.set<ProcessedLiveClassResults>(
            getCacheKey(orgSlug, "classResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: new Date(),
                results: classResults,
            },
            expiration
        );

        appCache.set<ProcessedLiveIndexResults>(
            getCacheKey(orgSlug, "indexedResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: new Date(),
                results: indexedResults,
            },
            expiration
        );

        appCache.set<ProcessedLiveRawResults>(
            getCacheKey(orgSlug, "rawResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: new Date(),
                results: rawResults,
            },
            expiration
        );
    }
}

export const liveResultsService = new LiveResultsService();
