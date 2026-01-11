'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                'rounded-full border-white/10 animate-spin',
                sizeClasses[size],
                className
            )}
            style={{
                borderTopColor: 'hsl(270 60% 50%)',
                borderRightColor: 'hsl(330 81% 60%)',
                borderBottomColor: 'hsl(187 94% 43%)',
            }}
        />
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Generating your avatar...' }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-card p-8 text-center max-w-sm">
                <LoadingSpinner size="lg" className="mx-auto mb-6" />
                <p className="text-lg font-medium text-white/90">{message}</p>
                <p className="text-sm text-white/50 mt-2">This may take a moment...</p>

                <div className="flex justify-center gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-white/50"
                            style={{
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
