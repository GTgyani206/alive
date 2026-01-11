'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MoveHorizontal } from 'lucide-react';

interface ComparisonSliderProps {
    originalImage: string;
    avatarImage: string;
    className?: string;
}

export function ComparisonSlider({
    originalImage,
    avatarImage,
    className
}: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderPosition(percentage);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) handleMove(e.touches[0].clientX);
        };

        const handleEnd = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, handleMove]);

    return (
        <div
            ref={containerRef}
            className={cn('comparison-slider relative select-none', className)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <img
                src={avatarImage}
                alt="Generated Avatar"
                className="w-full h-auto block"
                draggable={false}
            />

            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                    style={{ width: containerRef.current?.offsetWidth || '100%', maxWidth: 'none' }}
                    draggable={false}
                />
            </div>

            <div
                className="divider"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <MoveHorizontal className="w-5 h-5 text-gray-700" />
                </div>
            </div>

            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">Original</span>
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">Avatar</span>
            </div>
        </div>
    );
}
