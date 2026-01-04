import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/card";
import { organizationService } from "@/services/organizations/organization.service";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/ui/button";
import {
    ArrowRightIcon,
    CalendarIcon,
    FilterIcon,
    SearchIcon,
    SortAscIcon,
    UsersIcon,
} from "lucide-react";
import { Input } from "@/ui/input";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="mb-12 w-full rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 py-12 dark:from-orange-950 dark:to-slate-950 sm:py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                        Live Timing & Results
                    </h1>
                    <p className="mb-6 text-lg text-muted-foreground">
                        Track motorsports results and live timing across all
                        your organizations
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button size="lg" asChild>
                            <Link href="#organizations">
                                Browse Organizations
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div
                id="organizations"
                className="mb-8 flex flex-col gap-4 sm:flex-row"
            >
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search organizations..."
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                        <FilterIcon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                        <SortAscIcon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Sort</span>
                    </Button>
                </div>
            </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {orgs.map((org, index) => (
                        <Link
                            key={org.orgId}
                            href={`/t/${org.slug}`}
                            className="group"
                            aria-label={`View more about ${org.name}`}
                        >
                            <Card className="relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500">
                                    <Image
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={org.name}
                                        width={400}
                                        height={225}
                                        src={`https://picsum.photos/400/225?random=${index}`}
                                    />
                                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">
                                        Active
                                    </div>
                                </div>

                                <CardHeader className="space-y-3">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="line-clamp-1">
                                            {org.name}
                                        </span>
                                        <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                                    </CardTitle>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4 shrink-0" />
                                            <span>8 Events</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <UsersIcon className="h-4 w-4 shrink-0" />
                                            <span>156 Drivers</span>
                                        </span>
                                    </div>

                                    <CardDescription className="line-clamp-2">
                                        View event results, live timing, and
                                        leaderboards for {org.name}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
        </div>
    );
}
