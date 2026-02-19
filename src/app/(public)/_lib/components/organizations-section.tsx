import Link from "next/link";
import { Button } from "@/ui/button";
import type { Organization } from "@/dto/organizations";
import { OrgCard, type NextEvent } from "./org-card";

type OrganizationsSectionProps = {
    orgs: Organization[];
    upcomingCountByOrgId: Record<string, number>;
    nextEventByOrgId: Record<string, NextEvent | null>;
    today: string;
};

export function OrganizationsSection({
    orgs,
    upcomingCountByOrgId,
    nextEventByOrgId,
    today,
}: OrganizationsSectionProps) {
    return (
        <section
            id="organizations"
            className="container mx-auto px-4 py-12 sm:py-16"
        >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Organizations
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Select a club to view events, live timing, and results
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/events">View all events</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                    <OrgCard
                        key={org.orgId}
                        org={org}
                        upcomingCount={upcomingCountByOrgId[org.orgId] ?? 0}
                        nextEvent={nextEventByOrgId[org.orgId] ?? null}
                        today={today}
                    />
                ))}
            </div>
        </section>
    );
}
