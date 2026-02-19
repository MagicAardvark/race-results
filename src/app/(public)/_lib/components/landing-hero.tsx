import { Button } from "@/ui/button";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";

const HERO_IMAGE = "/hero-header.svg";

export function LandingHero() {
    return (
        <section
            className="relative min-h-[52.5vh] w-full overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            aria-label="Hero"
        >
            <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950 from-0% via-slate-950/40 to-transparent"
                aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 z-10 w-full px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        Live Timing & Results
                    </h1>
                    <p className="text-muted-foreground mb-6 text-base text-white/90 sm:text-lg">
                        Track motorsports results and live timing across all
                        your organizations
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button size="lg" asChild>
                            <Link href="#organizations">
                                Browse organizations
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white/95 text-slate-900 hover:bg-white"
                            asChild
                        >
                            <Link href="/events">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                View all events
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
