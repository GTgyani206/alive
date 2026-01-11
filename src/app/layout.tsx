import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
    title: "AvatarAI - Transform Photos to Anime Avatars",
    description: "Transform your photos into stunning anime-style 3D avatars using AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen flex flex-col">
                <div className="aurora-bg" />
                <div className="fixed inset-0 grid-pattern pointer-events-none" />
                <Header />
                <main className="flex-1 pt-28 pb-8">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
