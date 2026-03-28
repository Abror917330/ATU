"use client";
import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Feather, Video, Music, Newspaper, Calendar, Megaphone, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/../store/useFavorites';
import { PRODUCTS, formatPrice } from '@/lib/shopData';
import { CREATIVE_ITEMS } from '@/lib/creativeData';
import { YOUTH_POSTS } from '../uzgen-youth/page';

export default function FavoritesPage() {
    const [activeTab, setActiveTab] = useState<'shop' | 'creative' | 'uzgen'>('shop');
    const [mounted, setMounted] = useState(false);
    const { shopIds, creativeIds, toggleShop, toggleCreative } = useFavorites();
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    const favShopProducts = PRODUCTS.filter(p => shopIds.includes(p.id));
    const favCreativeItems = CREATIVE_ITEMS.filter(c => creativeIds.includes(c.id));
    const favYouthPosts = YOUTH_POSTS.filter(p => creativeIds.includes(p.id));

    if (!mounted) return null;

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            video: <Video size={14} className="text-purple-500" />,
            audio: <Music size={14} className="text-brand-gold" />,
            poem: <Feather size={14} className="text-brand-gold" />,
            news: <Newspaper size={14} className="text-blue-500" />,
            event: <Calendar size={14} className="text-green-500" />,
            announcement: <Megaphone size={14} className="text-brand-gold" />,
        };
        return icons[type] || <Heart size={14} className="text-red-500" />;
    };

    const getTypeLabel: Record<string, string> = {
        video: 'Video', audio: 'Audio', poem: "She'r",
        news: 'Yangilik', event: 'Tadbir', announcement: "E'lon",
    };

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-4xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white">
                        <span className="text-brand-gold">SEVIMLILAR</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 italic">
                        Saqlangan mahsulot va ijodlar
                    </p>
                </div>

                {/* TABLAR */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-8">
                    {[
                        { id: 'shop', label: "Do'kon", icon: ShoppingBag, count: favShopProducts.length },
                        { id: 'creative', label: 'Ijod', icon: Heart, count: favCreativeItems.length },
                        { id: 'uzgen', label: 'Uzgoniylar', icon: Users, count: favYouthPosts.length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                    : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* SHOP */}
                {activeTab === 'shop' && (
                    favShopProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <ShoppingBag size={48} className="text-gray-300" />
                            <p className="text-gray-400 font-bold">Hech narsa yo'q</p>
                            <button onClick={() => router.push('/shop')} className="px-6 py-3 bg-brand-gold text-black font-black rounded-2xl text-sm">
                                Do'konga o'tish
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {favShopProducts.map(product => (
                                <div key={product.id} className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all">
                                    <div className="relative aspect-square">
                                        <div onClick={() => router.push(`/shop/${product.id}`)} className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-t-3xl overflow-hidden cursor-pointer">
                                            {product.images[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag size={40} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleShop(product.id)}
                                            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Heart size={16} className="fill-red-500 text-red-500" />
                                        </button>
                                    </div>
                                    <div onClick={() => router.push(`/shop/${product.id}`)} className="p-4 cursor-pointer">
                                        <h3 className="font-black text-sm dark:text-white uppercase tracking-tight mb-1 line-clamp-1 group-hover:text-brand-gold transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-brand-gold font-black">{formatPrice(product.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* IJOD */}
                {activeTab === 'creative' && (
                    favCreativeItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Heart size={48} className="text-gray-300" />
                            <p className="text-gray-400 font-bold">Hech narsa yo'q</p>
                            <button onClick={() => router.push('/creative')} className="px-6 py-3 bg-brand-gold text-black font-black rounded-2xl text-sm">
                                Ijodga o'tish
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {favCreativeItems.map(item => (
                                <div key={item.id} onClick={() => router.push(`/creative/${item.id}`)} className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(item.type)}
                                            <span className="text-xs text-gray-400 uppercase font-bold">{getTypeLabel[item.type]}</span>
                                        </div>
                                        <button onClick={e => { e.stopPropagation(); toggleCreative(item.id); }} className="p-1.5 rounded-full hover:scale-110 transition-all">
                                            <Heart size={18} className="fill-red-500 text-red-500" />
                                        </button>
                                    </div>
                                    <h3 className="font-black text-base dark:text-white group-hover:text-brand-gold transition-colors uppercase italic line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* UZGONIYLAR */}
                {activeTab === 'uzgen' && (
                    favYouthPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Users size={48} className="text-gray-300" />
                            <p className="text-gray-400 font-bold">Hech narsa yo'q</p>
                            <button onClick={() => router.push('/uzgen-youth')} className="px-6 py-3 bg-brand-gold text-black font-black rounded-2xl text-sm">
                                Uzgoniylarga o'tish
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {favYouthPosts.map(post => (
                                <div key={post.id} onClick={() => router.push(`/uzgen-youth/${post.id}`)} className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(post.type)}
                                            <span className="text-xs text-gray-400 uppercase font-bold">{getTypeLabel[post.type] || post.type}</span>
                                        </div>
                                        <button onClick={e => { e.stopPropagation(); toggleCreative(post.id); }} className="p-1.5 rounded-full hover:scale-110 transition-all">
                                            <Heart size={18} className="fill-red-500 text-red-500" />
                                        </button>
                                    </div>
                                    <h3 className="font-black text-base dark:text-white group-hover:text-brand-gold transition-colors uppercase italic line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-2">{post.date}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}

            </div>
        </main>
    );
}