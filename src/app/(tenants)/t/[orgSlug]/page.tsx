import { tenantService } from "@/services/tenants/tenant.service";
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import {
    ExternalLinkIcon,
    CalendarIcon,
    ArrowLeftIcon,
} from "lucide-react";
import { CgMediaLive as LiveIcon } from "react-icons/cg";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/card";

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function isSingleDay(start: string, end: string): boolean {
    return start === end;
}

export default async function Page() {
    const tenant = await tenantService.getTenant();

    if (!tenant.isValid || tenant.isGlobal) {
        redirect("/");
    }

    // Fetch events if organization has MotorsportReg ID
    let events: Awaited<
        ReturnType<typeof motorsportRegService.getOrganizationCalendar>
    >["response"]["events"] = [];

    if (tenant.org.motorsportregOrgId) {
        try {
            const response = await motorsportRegService.getOrganizationCalendar(
                tenant.org.motorsportregOrgId,
                {
                    exclude_cancelled: true,
                }
            );
            events = response.response.events;
        } catch (error) {
            console.error("Failed to fetch MotorsportReg events:", error);
            // Continue without events if API call fails
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Organizations
                </Link>
            </Button>

            {/* Organization Header */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold sm:text-4xl">
                            {tenant.org.name}
                        </h1>
                        {tenant.org.motorsportregOrgId && (
                            <p className="mt-2 text-muted-foreground">
                                View upcoming events and results for this
                                organization
                            </p>
                        )}
                    </div>
                    <Button size="lg" asChild>
                        <Link href={`/t/${tenant.org.slug}/live`}>
                            <LiveIcon className="mr-2 h-5 w-5 animate-pulse text-white" />
                            Live Timing
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Events Section */}
            {tenant.org.motorsportregOrgId ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Upcoming Events
                        </CardTitle>
                        <CardDescription>
                            Events scheduled for this organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {events.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">
                                    No upcoming events found.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">
                                                Event
                                            </TableHead>
                                            <TableHead className="hidden sm:table-cell">
                                                Type
                                            </TableHead>
                                            <TableHead className="min-w-[150px]">
                                                Date
                                            </TableHead>
                                            <TableHead className="hidden lg:table-cell">
                                                Venue
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => {
                                            const singleDay = isSingleDay(
                                                event.start,
                                                event.end
                                            );

                                            return (
                                                <TableRow key={event.id}>
                                                    <TableCell className="font-medium">
                                                        {event.name}
                                                        {event.type && (
                                                            <span className="ml-2 block text-xs text-muted-foreground sm:hidden">
                                                                {event.type}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        {event.type}
                                                    </TableCell>
                                                    <TableCell>
                                                        {singleDay ? (
                                                            formatDate(event.start)
                                                        ) : (
                                                            <span>
                                                                {formatDate(
                                                                    event.start
                                                                )}
                                                                <span className="hidden sm:inline">
                                                                    {" "}
                                                                    -{" "}
                                                                    {formatDate(
                                                                        event.end
                                                                    )}
                                                                </span>
                                                                <span className="block text-xs text-muted-foreground sm:hidden">
                                                                    to{" "}
                                                                    {formatDate(
                                                                        event.end
                                                                    )}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        {event.venue.name},{" "}
                                                        {event.venue.city},{" "}
                                                        {event.venue.region}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            className="w-full sm:w-auto"
                                                        >
                                                            <Link
                                                                href={
                                                                    event.detailuri
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <span className="hidden sm:inline">
                                                                    View Event
                                                                </span>
                                                                <span className="sm:hidden">
                                                                    View
                                                                </span>
                                                                <ExternalLinkIcon className="ml-2 h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            No MotorsportReg integration configured for this
                            organization.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
