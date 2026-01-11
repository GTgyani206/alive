'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, Download, RotateCcw, ArrowLeft } from 'lucide-react';
import { ImageUploader, StyleSelector, GlassCard, ComparisonSlider, LoadingOverlay } from '@/components/ui';
import { getSessionToken } from '@/lib/utils';
import type { AnimeStyle } from '@/types';

export default function GeneratePage() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [style, setStyle] = useState<AnimeStyle>('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = useCallback((file: File, previewUrl: string) => {
        setSelectedFile(file);
        setPreview(previewUrl);
        setGeneratedAvatar(null);
        setError(null);
    }, []);

    const handleClear = useCallback(() => {
        setSelectedFile(null);
        setPreview(null);
        setGeneratedAvatar(null);
        setError(null);
    }, []);

    const handleGenerate = async () => {
        if (!selectedFile || !preview) return;
        setIsGenerating(true);
        setError(null);

        try {
            const sessionToken = getSessionToken();
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('sessionToken', sessionToken);
            formData.append('style', style);

            const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await uploadResponse.json();

            if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

            const generateResponse = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ generationId: uploadData.generationId, imageBase64: preview, style }),
            });

            const generateData = await generateResponse.json();
            if (!generateData.success) throw new Error(generateData.error || 'Generation failed');

            setGeneratedAvatar(generateData.avatarUrl);
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedAvatar) return;
        try {
            if (generatedAvatar.startsWith('data:')) {
                const a = document.createElement('a');
                a.href = generatedAvatar;
                a.download = `avatar-${style}-${Date.now()}.png`;
                a.click();
            } else {
                const response = await fetch(generatedAvatar);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `avatar-${style}-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <>
            {isGenerating && <LoadingOverlay message="Creating your anime avatar..." />}

            <div className="container max-w-5xl">
                <div className="mb-8">
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </button>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                        Create Your <span className="gradient-text">Avatar</span>
                    </h1>
                    <p className="text-white/50">Upload a photo and transform it into an anime character</p>
                </div>

                {generatedAvatar && preview ? (
                    <div className="animate-fade-in">
                        <GlassCard className="mb-6">
                            <h2 className="font-heading text-xl font-semibold mb-4 text-center">Your Avatar is Ready! ✨</h2>
                            <ComparisonSlider originalImage={preview} avatarImage={generatedAvatar} className="max-w-2xl mx-auto rounded-2xl overflow-hidden" />
                        </GlassCard>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={handleDownload} className="btn-primary"><Download className="w-5 h-5" /><span>Download Avatar</span></button>
                            <button onClick={() => setGeneratedAvatar(null)} className="btn-secondary"><RotateCcw className="w-5 h-5" /><span>Try Different Style</span></button>
                            <button onClick={handleClear} className="btn-secondary"><span>New Photo</span></button>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">
                        <GlassCard>
                            <h2 className="font-heading text-lg font-semibold mb-4">1. Upload Your Photo</h2>
                            <ImageUploader onImageSelect={handleImageSelect} preview={preview} onClear={handleClear} disabled={isGenerating} />
                        </GlassCard>

                        <GlassCard>
                            <h2 className="font-heading text-lg font-semibold mb-4">2. Select Style & Generate</h2>
                            <StyleSelector selected={style} onChange={setStyle} disabled={isGenerating} />
                            {error && (
                                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}
                            <div className="mt-8">
                                <button onClick={handleGenerate} disabled={!selectedFile || isGenerating} className="btn-primary w-full">
                                    <Wand2 className="w-5 h-5" />
                                    <span>{isGenerating ? 'Generating...' : 'Generate Avatar'}</span>
                                </button>
                                {!selectedFile && <p className="text-xs text-white/40 text-center mt-3">Upload a photo to enable generation</p>}
                            </div>
                        </GlassCard>
                    </div>
                )}

                {!generatedAvatar && (
                    <div className="mt-8">
                        <GlassCard className="p-4">
                            <p className="text-sm text-white/50 text-center">
                                💡 <strong className="text-white/70">Tip:</strong> For best results, use a clear front-facing photo with good lighting.
                            </p>
                        </GlassCard>
                    </div>
                )}
            </div>
        </>
    );
}
