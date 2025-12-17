import { userService } from "@/services/users/user.service";
import { ROLES } from "@/dto/users";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default async function GlobalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await userService.getCurrentUser();

    return (
        <div className="flex flex-col gap-4">
            {children}
            <div className="w-1/2 mx-auto">
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                {user?.roles.find((r) => r === ROLES.admin) ? (
                    <div>
                        <Link href={"/admin"}>Admin</Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
