"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Play, Music, Calendar, Share2, Loader2, Heart } from 'lucide-react';
import { useFavorites } from '@/../store/useFavorites';

export default function CreativeDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toggleCreative, isCreativeFaved } = useFavorites();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        const { data } = await supabase.from('creative_items').select('*').eq('id', id).single();
        if (data) {
            setItem(data);
            // Ichki ko'rishni oshirish
            await supabase
                .from('creative_items')
                .update({ views_detail: (data.views_detail || 0) + 1 })
                .eq('id', id);
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-main-bg"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>;
    if (!item) return <div className="p-10 text-center font-black dark:text-white">TOPILMADI!</div>;

    const faved = mounted && isCreativeFaved(item.id);

    return (
        <main className="min-h-screen bg-main-bg pb-20">
            <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-main-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <button onClick={() => router.back()} className="p-3 bg-white dark:bg-white/5 rounded-2xl text-gray-400 dark:text-white active:scale-90 transition-all border border-gray-100 dark:border-white/10">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-[10px] font-black uppercase tracking-[3px] dark:text-white opacity-50 truncate max-w-[150px]">
                    {item.title}
                </div>
                <button onClick={() => toggleCreative(item.id)} className="p-3 bg-white dark:bg-white/5 rounded-2xl active:scale-90 transition-all border border-gray-100 dark:border-white/10">
                    <Heart size={20} className={faved ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-white/20'} />
                </button>
            </div>

            <div className="max-w-2xl mx-auto px-6 pt-24">
                {item.thumbnail && (
                    <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 border border-gray-100 dark:border-white/10 shadow-2xl">
                        <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                )}

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-brand-gold text-black text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{item.type}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                            <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-[1000] uppercase italic dark:text-white leading-tight">
                        {item.title}
                    </h1>
                </div>

                <div className="mb-10">
                    {item.type === 'video' && (
                        <div className="rounded-3xl overflow-hidden bg-black shadow-xl border border-white/10 aspect-video">
                            <video src={item.content} controls className="w-full h-full" />
                        </div>
                    )}
                    {item.type === 'audio' && (
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-brand-gold rounded-2xl text-black animate-pulse"><Music size={24} /></div>
                                <div className="text-xs font-black uppercase dark:text-white">Audio fayl tinglanmoqda...</div>
                            </div>
                            <audio src={item.content} controls className="w-full" />
                        </div>
                    )}
                </div>

                <div className="relative bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-sm">
                    {item.type === 'poem' ? (
                        <div className="whitespace-pre-line font-medium text-xl md:text-2xl italic leading-relaxed text-gray-800 dark:text-gray-200 border-l-4 border-brand-gold pl-6">
                            {item.content}
                        </div>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic text-sm text-center">Tavsif mavjud emas.</p>
                    )}
                </div>

                <button
                    onClick={() => navigator.share({ title: item.title, url: window.location.href })}
                    className="w-full p-6 bg-brand-gold text-black rounded-3xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-gold/10"
                >
                    <Share2 size={20} /> DO'STLARGA ULASHISH
                </button>
            </div>
        </main>
    );
}