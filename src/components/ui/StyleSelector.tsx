'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AnimeStyle } from '@/types';
import { Sparkles, Heart, Film, Zap } from 'lucide-react';

interface StyleSelectorProps {
    selected: AnimeStyle;
    onChange: (style: AnimeStyle) => void;
    disabled?: boolean;
}

const styles: { id: AnimeStyle; name: string; description: string; icon: React.ReactNode }[] = [
    {
        id: 'modern',
        name: 'Modern Anime',
        description: 'Vibrant colors & detailed shading',
        icon: <Sparkles className="w-5 h-5" />,
    },
    {
        id: 'chibi',
        name: 'Chibi',
        description: 'Cute & oversized features',
        icon: <Heart className="w-5 h-5" />,
    },
    {
        id: 'ghibli',
        name: 'Ghibli Style',
        description: 'Soft, hand-painted aesthetic',
        icon: <Film className="w-5 h-5" />,
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'Neon & futuristic vibes',
        icon: <Zap className="w-5 h-5" />,
    },
];

export function StyleSelector({ selected, onChange, disabled = false }: StyleSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70">
                Choose Style
            </label>
            <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => !disabled && onChange(style.id)}
                        disabled={disabled}
                        className={cn(
                            'style-card text-left',
                            selected === style.id && 'selected',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                'p-2 rounded-lg transition-colors',
                                selected === style.id
                                    ? 'bg-white/10 text-white'
                                    : 'bg-white/5 text-white/60'
                            )}>
                                {style.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-white/90 truncate">
                                    {style.name}
                                </p>
                                <p className="text-xs text-white/50 truncate">
                                    {style.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
