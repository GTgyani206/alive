'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    onImageSelect: (file: File, preview: string) => void;
    preview?: string | null;
    onClear?: () => void;
    disabled?: boolean;
}

export function ImageUploader({
    onImageSelect,
    preview,
    onClear,
    disabled = false
}: ImageUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageSelect(file, event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [disabled, onImageSelect]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageSelect(file, event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const handleClick = useCallback(() => {
        if (!disabled && !preview) {
            inputRef.current?.click();
        }
    }, [disabled, preview]);

    if (preview) {
        return (
            <div className="relative animate-scale-in">
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                    <img
                        src={preview}
                        alt="Selected"
                        className="w-full h-auto max-h-[400px] object-contain"
                    />
                    {onClear && !disabled && (
                        <button
                            onClick={onClear}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            aria-label="Remove image"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'upload-zone min-h-[300px]',
                isDragOver && 'drag-over',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Upload className="w-10 h-10 text-white/60" />
                </div>

                <div>
                    <p className="text-lg font-medium text-white/90 mb-1">
                        Drop your photo here
                    </p>
                    <p className="text-sm text-white/50">
                        or click to browse • JPEG, PNG, WebP up to 10MB
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                    <ImageIcon className="w-4 h-4" />
                    <span>Best results with clear face photos</span>
                </div>
            </div>
        </div>
    );
}
