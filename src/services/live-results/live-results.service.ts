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
    getClassResults(orgSlug: string): Promise<ProcessedLiveClassResults | null>;
    getIndexedResults(
        orgSlug: string
    ): Promise<ProcessedLiveIndexResults | null>;
    getRawResults(orgSlug: string): Promise<ProcessedLiveRawResults | null>;
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

    async getClassResults(
        orgSlug: string
    ): Promise<ProcessedLiveClassResults | null> {
        const cached = await appCache.get<ProcessedLiveClassResults>(
            getCacheKey(orgSlug, "classResults")
        );

        return cached || null;
    }

    async getIndexedResults(
        orgSlug: string
    ): Promise<ProcessedLiveIndexResults | null> {
        const cached = await appCache.get<ProcessedLiveIndexResults>(
            getCacheKey(orgSlug, "indexedResults")
        );

        return cached || null;
    }

    async getRawResults(
        orgSlug: string
    ): Promise<ProcessedLiveRawResults | null> {
        const cached = await appCache.get<ProcessedLiveRawResults>(
            getCacheKey(orgSlug, "rawResults")
        );

        return cached || null;
    }

    private async updateCache(
        orgSlug: string,
        timestamp: Date,
        classResults: ClassResultsClass[],
        indexedResults: ResultsEntry[],
        rawResults: ResultsEntry[]
    ) {
        const expiration = 60 * 60 * 24; // 24 hours
        const processedTimestamp = new Date();

        await appCache.set<ProcessedLiveClassResults>(
            getCacheKey(orgSlug, "classResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: processedTimestamp,
                results: classResults,
            },
            expiration
        );

        await appCache.set<ProcessedLiveIndexResults>(
            getCacheKey(orgSlug, "indexedResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: processedTimestamp,
                results: indexedResults,
            },
            expiration
        );

        await appCache.set<ProcessedLiveRawResults>(
            getCacheKey(orgSlug, "rawResults"),
            {
                uploadTimestamp: timestamp,
                processedTimestamp: processedTimestamp,
                results: rawResults,
            },
            expiration
        );
    }
}

export const liveResultsService = new LiveResultsService();
