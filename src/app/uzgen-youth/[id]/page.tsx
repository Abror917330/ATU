"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Calendar, Newspaper, Megaphone, Video } from 'lucide-react';
import { YOUTH_POSTS } from '../page';
import { useFavorites } from '@/../store/useFavorites';

export default function YouthPostDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { toggleCreative, isCreativeFaved } = useFavorites();

    useEffect(() => setMounted(true), []);

    const post = YOUTH_POSTS.find(p => p.id === id);
    const faved = mounted && isCreativeFaved(id as string);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Topilmadi</p>
                    <button onClick={() => router.push('/uzgen-youth')} className="text-brand-gold font-black">
                        ← Orqaga
                    </button>
                </div>
            </div>
        );
    }

    const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
        news: { label: 'Yangilik', color: 'text-blue-500', icon: Newspaper },
        event: { label: 'Tadbir', color: 'text-green-500', icon: Calendar },
        announcement: { label: "E'lon", color: 'text-brand-gold', icon: Megaphone },
        video: { label: 'Video', color: 'text-purple-500', icon: Video },
    };

    const config = TYPE_CONFIG[post.type];
    const Icon = config.icon;

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-2xl mx-auto px-4">

                {/* ORQAGA */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-gold transition-colors mb-8"
                >
                    <ArrowLeft size={18} /> Orqaga
                </button>

                {/* TYPE */}
                <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className={config.color} />
                    <span className={`text-xs font-black uppercase tracking-widest ${config.color}`}>
                        {config.label}
                    </span>
                </div>

                {/* TITLE */}
                <h1 className="text-3xl font-black dark:text-white uppercase italic tracking-tight mb-2">
                    {post.title}
                </h1>
                <p className="text-xs text-gray-400 mb-8">{post.date}</p>

                {/* VIDEO */}
                {post.type === 'video' && post.videoUrl && (
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-8">
                        <iframe
                            src={post.videoUrl}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                )}

                {/* CONTENT */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-8 mb-8">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {post.content}
                    </p>
                </div>

                {/* LIKE VA SHARE */}
                <div className="flex gap-3">
                    <button
                        onClick={() => toggleCreative(id as string)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${faved
                                ? 'bg-red-500 text-white'
                                : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-gold'
                            }`}
                    >
                        <Heart size={16} className={faved ? 'fill-white' : ''} />
                        {faved ? 'Sevimlilar da' : 'Sevimlilar ga'}
                    </button>

                    <button
                        onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-gold transition-all"
                    >
                        <Share2 size={16} /> Ulashish
                    </button>
                </div>

            </div>
        </main>
    );
}