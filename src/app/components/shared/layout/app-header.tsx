import { userService } from "@/services/users/user.service";
import { ROLES } from "@/dto/users";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/ui/button";
import { CgMediaLive } from "react-icons/cg";

export async function AppHeader({
    sidebarTrigger,
}: {
    sidebarTrigger?: React.ReactNode;
}) {
    const user = await userService.getCurrentUser();

    return (
        <header className="bg-background relative z-50 w-full border-b">
            <div className="flex h-16 w-full items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    {sidebarTrigger}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold"
                    >
                        <span className="text-orange-500">🏁</span>
                        Race Results
                    </Link>
                    <nav className="hidden h-16 items-center gap-6 text-sm md:flex">
                        <Link
                            href="/"
                            className="flex h-full items-center border-b-2 border-transparent transition-colors duration-500 ease-in-out hover:border-orange-400 hover:text-orange-600"
                        >
                            Organizations
                        </Link>
                        <Link
                            href="/events"
                            className="flex h-full items-center border-b-2 border-transparent transition-colors duration-500 ease-in-out hover:border-orange-400 hover:text-orange-600"
                        >
                            Events
                        </Link>
                        <Link
                            href="/results"
                            className="flex h-full items-center border-b-2 border-transparent transition-colors duration-500 ease-in-out hover:border-orange-400 hover:text-orange-600"
                        >
                            Results
                        </Link>
                        <Link
                            href="/live"
                            className="flex h-full items-center gap-2 border-b-2 border-transparent transition-colors duration-500 ease-in-out hover:border-orange-400 hover:text-orange-600"
                        >
                            Live Timing{" "}
                            <CgMediaLive className="animate-pulse text-red-500" />
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user?.roles.includes(ROLES.admin) && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin">Admin</Link>
                        </Button>
                    )}
                    <SignedOut>
                        <SignInButton>
                            <Button size="sm">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}

