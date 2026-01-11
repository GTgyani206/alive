'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Image as ImageIcon, Plus } from 'lucide-react';
import { AvatarCard, GlassCard, ComparisonSlider } from '@/components/ui';
import { getSessionToken } from '@/lib/utils';
import type { Generation } from '@/types';

export default function HistoryPage() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const sessionToken = getSessionToken();
            const response = await fetch(`/api/history?sessionToken=${sessionToken}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Failed to fetch history');
            setGenerations(data.generations || []);
        } catch (err) {
            console.error('History fetch error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const completedGenerations = generations.filter((g) => g.status === 'completed' && g.avatar_url);

    return (
        <div className="container max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                        Your <span className="gradient-text">Gallery</span>
                    </h1>
                    <p className="text-white/50">All your generated avatars in one place</p>
                </div>
                <button onClick={fetchHistory} disabled={isLoading} className="btn-secondary">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="glass-card aspect-square animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="w-full h-full bg-white/5 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <GlassCard className="text-center py-12">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={fetchHistory} className="btn-secondary">Try Again</button>
                </GlassCard>
            ) : generations.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <div className="p-4 rounded-2xl bg-white/5 w-fit mx-auto mb-6">
                        <ImageIcon className="w-12 h-12 text-white/30" />
                    </div>
                    <h2 className="font-heading text-xl font-semibold mb-2 text-white/80">No avatars yet</h2>
                    <p className="text-white/50 mb-6 max-w-md mx-auto">Create your first anime avatar by uploading a photo!</p>
                    <Link href="/generate" className="btn-primary inline-flex">
                        <Plus className="w-5 h-5" />
                        <span>Create Avatar</span>
                    </Link>
                </GlassCard>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-heading font-bold gradient-text">{generations.length}</p>
                            <p className="text-xs text-white/50">Total Generations</p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-heading font-bold text-green-400">{completedGenerations.length}</p>
                            <p className="text-xs text-white/50">Completed</p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-heading font-bold text-purple-400">{generations.filter((g) => g.style === 'modern').length}</p>
                            <p className="text-xs text-white/50">Modern Style</p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-heading font-bold text-cyan-400">{generations.filter((g) => g.style === 'cyberpunk').length}</p>
                            <p className="text-xs text-white/50">Cyberpunk Style</p>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {generations.map((generation, index) => (
                            <div key={generation.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                <AvatarCard
                                    generation={generation}
                                    onClick={() => generation.status === 'completed' && generation.avatar_url && setSelectedGeneration(generation)}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedGeneration && selectedGeneration.avatar_url && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedGeneration(null)}>
                    <div className="glass-card p-4 max-w-2xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <ComparisonSlider originalImage={selectedGeneration.original_photo_url} avatarImage={selectedGeneration.avatar_url} className="rounded-xl" />
                        <button onClick={() => setSelectedGeneration(null)} className="btn-secondary w-full mt-4">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
