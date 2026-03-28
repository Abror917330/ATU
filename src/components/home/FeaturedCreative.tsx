"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Feather, Play, Music, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeaturedCreative() {
    const [featured, setFeatured] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data } = await supabase
                .from('creative_items')
                .select('*')
                .eq('show_on_home', true)
                .order('created_at', { ascending: false })
                .limit(3);
            if (data) setFeatured(data);
        };
        fetchFeatured();
    }, []);

    if (featured.length === 0) return null;

    const handleItemClick = async (item: any) => {
        // Tashqi ko'rishni oshirish
        await supabase.from('creative_items').update({ views_list: (item.views_list || 0) + 1 }).eq('id', item.id);
        router.push(`/creative/${item.id}`);
    };

    return (
        <section className="px-4 mb-12">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[3px] mb-1">Yangi ijod namunalar</p>
                    <h2 className="text-3xl font-[1000] italic uppercase dark:text-white leading-none">IJOD OLAMI</h2>
                </div>
                <button onClick={() => router.push('/creative')} className="p-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl">
                    <ChevronRight className="dark:text-white" size={20} />
                </button>
            </div>

            <div className="grid gap-4">
                {featured.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className="group relative flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] hover:border-brand-gold/50 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                    >
                        {/* Kichik rasm yoki Ikonka */}
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-gold opacity-30">
                                    {item.type === 'poem' ? <Feather size={32} /> : item.type === 'video' ? <Play size={32} /> : <Music size={32} />}
                                </div>
                            )}
                        </div>

                        {/* Matn qismi */}
                        <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black uppercase text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md mb-2 inline-block tracking-widest">
                                {item.type}
                            </span>
                            <h3 className="text-lg font-black italic uppercase dark:text-white truncate mb-1">
                                {item.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed italic">
                                {item.content?.substring(0, 50)}...
                            </p>
                        </div>

                        <div className="absolute top-4 right-4 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}