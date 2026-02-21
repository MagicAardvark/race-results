import { auth } from "@clerk/nextjs/server";
import { usersRepository } from "@/db/repositories/users.repo";
import { userService } from "@/services/users/user.service";
import { MePageClient } from "./_lib/me-page-client";

export default async function MePage() {
    const { userId } = await auth();
    let user = await userService.getCurrentUser();

    // If signed in with Clerk but no DB user yet (e.g. webhook not run), create
    // so we show the driver picker instead of "Sign in" (they can't sign in again).
    if (userId && !user) {
        await usersRepository.create(userId);
        user = await userService.getCurrentUser();
    }

    return <MePageClient user={user} />;
}
