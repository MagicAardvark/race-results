import { Separator } from "@/ui/separator";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export function AppFooter() {
    return (
        <footer className="bg-muted/50 mt-20 border-t py-12">
            <div className="container px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 font-bold">
                            <span className="text-orange-500">🏁</span>
                            Race Results
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Multi-tenant motorsports results and live timing
                            platform.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:underline">
                                    Organizations
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="hover:underline">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/results" className="hover:underline">
                                    Results
                                </Link>
                            </li>
                            <li>
                                <Link href="/live" className="hover:underline">
                                    Live Timing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Connect</h4>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                className="group"
                                title="Visit us on Facebook"
                            >
                                <FaFacebookF className="transition-all duration-500 group-hover:scale-110" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                className="group"
                                title="Visit us on Instagram"
                            >
                                <FaInstagram className="transition-all duration-500 group-hover:scale-110" />
                            </a>
                        </div>
                    </div>
                </div>
                <Separator className="my-8" />
                <p className="text-muted-foreground text-center text-sm">
                    © {new Date().getFullYear()} Race Results. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
}

