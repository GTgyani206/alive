'use client';

import React from 'react';
import { Download, Calendar } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Generation } from '@/types';

interface AvatarCardProps {
    generation: Generation;
    onClick?: () => void;
}

export function AvatarCard({ generation, onClick }: AvatarCardProps) {
    const isCompleted = generation.status === 'completed' && generation.avatar_url;

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!generation.avatar_url) return;

        try {
            const response = await fetch(generation.avatar_url);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avatar-${generation.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div
            className={cn(
                'glass-card p-4 cursor-pointer group',
                'animate-fade-in'
            )}
            onClick={onClick}
        >
            <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
                {isCompleted ? (
                    <>
                        <img
                            src={generation.avatar_url!}
                            alt="Generated Avatar"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <img
                                src={generation.original_photo_url}
                                alt="Original"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute bottom-2 left-2 text-xs text-white/80 font-medium">
                                Original
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        {generation.status === 'processing' ? (
                            <div className="text-center">
                                <div className="spinner mx-auto mb-2" />
                                <p className="text-xs text-white/50">Processing...</p>
                            </div>
                        ) : generation.status === 'failed' ? (
                            <p className="text-sm text-red-400">Failed</p>
                        ) : (
                            <p className="text-sm text-white/40">Pending</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(generation.created_at)}</span>
                </div>

                {isCompleted && (
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4 text-white/70" />
                    </button>
                )}
            </div>

            <div className="mt-2">
                <span className={cn(
                    'inline-block px-2 py-0.5 rounded-full text-xs capitalize',
                    generation.style === 'modern' && 'bg-purple-500/20 text-purple-300',
                    generation.style === 'chibi' && 'bg-pink-500/20 text-pink-300',
                    generation.style === 'ghibli' && 'bg-green-500/20 text-green-300',
                    generation.style === 'cyberpunk' && 'bg-cyan-500/20 text-cyan-300',
                )}>
                    {generation.style}
                </span>
            </div>
        </div>
    );
}
