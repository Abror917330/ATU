"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Newspaper, Calendar, Megaphone, Video, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    news: { label: 'Yangilik', color: 'text-blue-500 bg-blue-500/10', icon: Newspaper },
    event: { label: 'Tadbir', color: 'text-green-500 bg-green-500/10', icon: Calendar },
    announcement: { label: "E'lon", color: 'text-brand-gold bg-brand-gold/10', icon: Megaphone },
    video: { label: 'Video', color: 'text-purple-500 bg-purple-500/10', icon: Video },
};

export function UzgoniylarPreview() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase.from('youth_posts').select('*').order('created_at', { ascending: false }).limit(3);
            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>;

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[4px] mb-1">Yoshlar guruhi</p>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white uppercase italic tracking-tighter">UZGONIYLAR</h2>
                    </div>
                    <button onClick={() => router.push('/uzgen-youth')} className="flex items-center gap-2 text-xs font-black text-brand-gold hover:gap-3 transition-all uppercase tracking-widest">
                        Barchasi <ArrowRight size={14} />
                    </button>
                </div>

                <div className="space-y-3">
                    {posts.map(post => {
                        const config = TYPE_CONFIG[post.type] || TYPE_CONFIG.news;
                        const Icon = config.icon;
                        return (
                            <div key={post.id} onClick={() => router.push(`/uzgen-youth/${post.id}`)} className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${config.color}`}>
                                                <Icon size={10} /> {config.label}
                                            </span>
                                            {post.is_new && <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-brand-gold text-black">Yangi</span>}
                                        </div>
                                        <h3 className="font-black text-base dark:text-white group-hover:text-brand-gold transition-colors uppercase italic line-clamp-1">{post.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">{post.excerpt}</p>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-2">
                                        <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}