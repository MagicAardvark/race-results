import { db } from "@/db";
import { LiveResultsSnapshot } from "@/dto/live-results/ingest";
import { organizationService } from "@/services/organizations/organization.service";
import { EventEntryDTO } from "@/dto/results/event-closeout";
import { classConfigurationService } from "@/services/class-configuration/class-configuration.service";
import { eventsService } from "@/services/events/events.service";
import { LiveResultsParser } from "@/services/live-results/lib/live-results-parser";
import { Organization } from "@/dto/organizations";
import { eventCloseoutRepository } from "@/db/repositories/results/event-closeout.repo";

interface IEventCloseoutService {
    closeEvent(orgSlug: string, data: LiveResultsSnapshot): Promise<void>;
}

export class EventCloseoutService implements IEventCloseoutService {
    async closeEvent(
        orgSlug: string,
        data: LiveResultsSnapshot
    ): Promise<void> {
        const org = await organizationService.getOrganizationBySlug(orgSlug);

        if (!org) {
            throw new Error("Organization not found");
        }

        const currentEventId = await this.getCurrentEventId(org.orgId);

        if (!currentEventId) {
            throw new Error("No active event found to close out");
        }

        const eventEntries = await this.parseEventEntries(
            org,
            currentEventId,
            data
        );

        await eventCloseoutRepository.storeEventData({
            orgId: org.orgId,
            eventId: currentEventId,
            results: eventEntries,
        });
    }

    private async parseEventEntries(
        org: Organization,
        eventId: string,
        data: LiveResultsSnapshot
    ): Promise<EventEntryDTO[]> {
        const eventSegments = await this.getEventSegments(eventId);
        const eventConfig = await eventsService.getEventConfiguration();
        const classData = await classConfigurationService.getClassesForOrg(
            org.slug
        );

        const parser = new LiveResultsParser(classData, eventConfig, data);

        const { classResults } = await parser.buildResults();

        const results = [] as EventEntryDTO[];

        for (const classResult of classResults) {
            for (const entry of classResult.entries) {
                const matchingClass = classData.get(entry.class);

                const e = {
                    classId: matchingClass?.classId ?? null,
                    classGroupId: matchingClass?.classGroupId ?? null,
                    carNumber: entry.carNumber,
                    driverName: entry.driverName,
                    slug: entry.entryKey,
                    carModel: entry.carModel,
                    sponsor: entry.sponsor,
                    externalAccountId: entry.msrId,
                    runs: [],
                } as EventEntryDTO;

                entry.segments.map((segment, segmentIndex) => {
                    for (const [runNumber, run] of Object.entries(
                        segment.runs
                    )) {
                        const segmentId = eventSegments[segmentIndex] ?? null;

                        if (!segmentId) {
                            console.warn(
                                `No segment found for index ${segmentIndex}, skipping run`
                            );
                            return;
                        }

                        e.runs.push({
                            segmentId,
                            runNumber: Number.parseInt(runNumber),
                            status: run.status,
                            timeMs: run.rawTotalTime
                                ? Math.round(run.rawTotalTime * 1000)
                                : null,
                            penaltyCount: run.penalty,
                        });
                    }
                });

                results.push(e);
            }
        }

        return results;
    }

    private async getCurrentEventId(orgId: string): Promise<string | null> {
        const currentEvent = await db.query.events.findFirst({
            where: {
                orgId,
                startAt: { lte: new Date() },
                endAt: { gte: new Date() },
                deletedAt: { isNull: true },
            },
        });

        if (!currentEvent) {
            return null;
        }

        return currentEvent.eventId;
    }

    private async getEventSegments(eventId: string): Promise<string[]> {
        const segments = await db.query.eventSegments.findMany({
            where: { eventId },
            orderBy: (segments, { asc }) => [asc(segments.order)],
        });

        return segments.map((s) => s.segmentId);
    }
}

export const eventCloseoutService = new EventCloseoutService();
