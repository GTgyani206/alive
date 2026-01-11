'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, History, Wand2 } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            <div className="glass-card-heavy mx-4 mt-4 rounded-2xl">
                <div className="container flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl text-white">
                            Avatar<span className="gradient-text">AI</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link
                            href="/generate"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Wand2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Create</span>
                        </Link>
                        <Link
                            href="/history"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <History className="w-4 h-4" />
                            <span className="hidden sm:inline">History</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
