import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, Zap, Shield } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="container">
            <section className="py-12 md:py-20 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-white/70">Powered by Gemini AI</span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Transform Your Photos Into
                        <span className="block gradient-text">Stunning Anime Avatars</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
                        Upload any photo and watch AI transform it into a beautiful anime-style character.
                        Choose from multiple styles and create your perfect avatar in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/generate" className="btn-primary group">
                            <span>Create Your Avatar</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/history" className="btn-secondary">View Gallery</Link>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="p-3 rounded-2xl bg-purple-500/10 w-fit mb-5">
                            <Palette className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-3 text-white/90">Multiple Styles</h3>
                        <p className="text-white/50 leading-relaxed">
                            Choose from Modern Anime, Chibi, Ghibli-inspired, or Cyberpunk styles.
                        </p>
                    </div>

                    <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="p-3 rounded-2xl bg-cyan-500/10 w-fit mb-5">
                            <Zap className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-3 text-white/90">Lightning Fast</h3>
                        <p className="text-white/50 leading-relaxed">
                            Get your anime avatar in seconds. Our AI processes your photo instantly.
                        </p>
                    </div>

                    <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="p-3 rounded-2xl bg-pink-500/10 w-fit mb-5">
                            <Shield className="w-7 h-7 text-pink-400" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-3 text-white/90">Your Privacy First</h3>
                        <p className="text-white/50 leading-relaxed">
                            Your photos are processed securely and stored privately.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="glass-card p-8 md:p-12 text-center">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Ready to Create Your Avatar?</h2>
                    <p className="text-white/50 mb-8 max-w-md mx-auto">
                        Join thousands of users who have transformed their photos into stunning anime characters.
                    </p>
                    <Link href="/generate" className="btn-primary inline-flex">
                        <span>Get Started Free</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
