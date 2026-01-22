import { UserProvider } from "@/context/UserContext";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Race Results",
    description: "",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUserCached();

    return (
        <ClerkProvider>
            <html lang="en" className={notoSans.variable}>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <UserProvider user={user}>{children}</UserProvider>
                    <Toaster position="top-center" richColors />
                </body>
            </html>
        </ClerkProvider>
    );
}
