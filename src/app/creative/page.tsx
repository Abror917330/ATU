"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Feather, Video, Music, BookOpen, Loader2, Play, Heart, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useFavorites } from '@/../store/useFavorites';
import { useRouter } from 'next/navigation';

export default function CreativePage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { toggleCreative, isCreativeFaved } = useFavorites();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const { data } = await supabase.from('creative_items').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
        setLoading(false);
    };

    // Tashqi ko'rishni oshirish funksiyasi
    const handleItemClick = async (item: any) => {
        await supabase
            .from('creative_items')
            .update({ views_list: (item.views_list || 0) + 1 })
            .eq('id', item.id);

        router.push(`/creative/${item.id}`);
    };

    const filtered = useMemo(() => {
        return items.filter(item => {
            const matchTab = activeTab === 'all' || item.type === activeTab;
            return matchTab && item.title.toLowerCase().includes(search.toLowerCase());
        });
    }, [activeTab, search, items]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-main-bg"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>;

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter dark:text-white">
                        IJOD<span className="text-brand-gold">.</span>
                    </h1>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" placeholder="Qidirish..."
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm dark:text-white focus:outline-none focus:ring-1 ring-brand-gold"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {['all', 'poem', 'video', 'audio'].map(tab => (
                            <button
                                key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab ? 'bg-brand-gold border-brand-gold text-black' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 dark:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className="group flex items-center gap-4 p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-brand-gold/50 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-white/10 flex items-center justify-center border border-gray-100 dark:border-white/5">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="text-brand-gold opacity-50">
                                        {item.type === 'poem' ? <Feather size={24} /> : item.type === 'video' ? <Play size={24} /> : <Music size={24} />}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-sm dark:text-white uppercase italic truncate group-hover:text-brand-gold transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                    {item.content?.substring(0, 60)}...
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[9px] font-black uppercase text-brand-gold opacity-80 tracking-tighter">{item.type}</span>
                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={e => { e.stopPropagation(); toggleCreative(item.id); }}
                                className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                <Heart size={18} className={mounted && isCreativeFaved(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-white/20'} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}