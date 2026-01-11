import React from 'react';
import { Github, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="py-8 mt-auto">
            <div className="container">
                <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-white/50 flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-pink-500" /> using Gemini AI
                        </p>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                <span>Source</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
