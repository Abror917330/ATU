"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- 1. MAHSULOT KARTОCHKASI (LIKE VA GALEREYA BILAN) ---
function ProductCard({ product }: { product: any }) {
    const [currentImg, setCurrentImg] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ['https://via.placeholder.com/400'];

    useEffect(() => {
        // Sahifa yuklanganda Like holatini tekshirish
        const likes = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsLiked(likes.includes(product.id));

        // Avtomatik rasm almashishi
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImg((prev) => (prev + 1) % images.length);
            }, 3500);
            return () => clearInterval(interval);
        }
    }, [product.id, images.length]);

    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let likes = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (likes.includes(product.id)) {
            likes = likes.filter((id: string) => id !== product.id);
            setIsLiked(false);
        } else {
            likes.push(product.id);
            setIsLiked(true);
        }
        localStorage.setItem('wishlist', JSON.stringify(likes));
    };

    return (
        <div className="group bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-brand-gold/50 transition-all duration-500 shadow-sm relative">
            {/* LIKE TUGMASI */}
            <button
                onClick={toggleLike}
                className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 dark:bg-black/30 backdrop-blur-md rounded-full shadow-sm active:scale-75 transition-all"
            >
                <Heart
                    size={18}
                    fill={isLiked ? "#ef4444" : "none"}
                    className={isLiked ? "text-red-500" : "text-gray-400"}
                />
            </button>

            <Link href={`/shop/${product.id}`}>
                <div className="aspect-square overflow-hidden relative">
                    <img
                        src={images[currentImg]}
                        alt={product.name || ""}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                            {images.map((_, idx) => (
                                <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${currentImg === idx ? 'bg-brand-gold w-4' : 'bg-white/30 w-1'}`} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 sm:p-5">
                    <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-1 opacity-80">
                        {product.sub_category || product.main_category}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate mb-1">
                        {product.name || product.sub_category}
                    </h3>
                    <p className="text-brand-gold font-black text-sm sm:text-lg">
                        {Number(product.price || 0).toLocaleString('ru-RU')} <span className="text-[10px] opacity-70">SOM</span>
                    </p>
                </div>
            </Link>
        </div>
    );
}

// --- 2. ASOSIY SHOP CONTENT (FILTRLAR VA SAVATCHA BILAN) ---
export default function ShopContent({ products }: { products: any[] }) {
    const [activeMain, setActiveMain] = useState('all');
    const [activeSub, setActiveSub] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dbMains, setDbMains] = useState<string[]>([]);
    const [dbSubs, setDbSubs] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCats = async () => {
            const { data: mains } = await supabase.from('main_cats').select('name');
            if (mains) setDbMains(mains.map(m => m.name));
            const { data: subs } = await supabase.from('sub_cats').select('name, main_name');
            if (subs) setDbSubs(subs);
        };

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };

        fetchCats();
        updateCartCount();

        // Savatcha o'zgarganda (boshqa sahifada bo'lsa ham) darhol yangilash
        window.addEventListener('storage', updateCartCount);
        // Custom event qo'shish (shuning ichida update qilish uchun)
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const availableSubs = useMemo(() => {
        if (activeMain === 'all') return [];
        return dbSubs.filter(s => s.main_name === activeMain).map(s => s.name);
    }, [activeMain, dbSubs]);

    const finalProducts = useMemo(() => {
        const list = Array.isArray(products) ? products : [];
        return list.filter(p => {
            const matchMain = activeMain === 'all' || p.main_category === activeMain;
            const matchSub = activeSub === 'all' || p.sub_category === activeSub;
            const pName = (p.name || p.sub_category || "").toLowerCase();
            const matchSearch = pName.includes(searchQuery.toLowerCase());
            return matchMain && matchSub && matchSearch;
        });
    }, [products, activeMain, activeSub, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative min-h-screen">
            {/* QIDIRUV */}
            <div className="mb-6">
                <Input
                    icon={<Search size={20} />}
                    placeholder="Маҳсулот қидириш..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* ASOSIY KATEGORIYALAR */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
                <button
                    onClick={() => { setActiveMain('all'); setActiveSub('all'); }}
                    className={`px-6 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase whitespace-nowrap transition-all ${activeMain === 'all' ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' : 'bg-white dark:bg-white/5 text-gray-500 hover:text-brand-gold'}`}
                >
                    Барчаси
                </button>
                {dbMains.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setActiveMain(cat); setActiveSub('all'); }}
                        className={`px-6 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase whitespace-nowrap transition-all ${activeMain === cat ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' : 'bg-white dark:bg-white/5 text-gray-500 hover:text-brand-gold'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ICHKI KATEGORIYALAR */}
            {activeMain !== 'all' && availableSubs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                    <button
                        onClick={() => setActiveSub('all')}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${activeSub === 'all' ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-transparent text-gray-400 bg-white dark:bg-white/5'}`}
                    >
                        Ҳаммаси
                    </button>
                    {availableSubs.map((sub: string) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSub(sub)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${activeSub === sub ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-transparent text-gray-400 bg-white dark:bg-white/5'}`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

            {/* MAHSULOTLAR GRIDI */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pb-20">
                {finalProducts.length > 0 ? (
                    finalProducts.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase text-sm tracking-widest">
                        Маҳсулот топилмади
                    </div>
                )}
            </div>

            {/* 🛒 SUZUVCHI SAVATCHA TUGMASI (Teparoqda) */}
            {cartCount > 0 && (
                <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Link href="/cart">
                        <div className="relative bg-brand-gold text-black p-5 rounded-full shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-90 transition-all cursor-pointer group">
                            <ShoppingBag size={28} strokeWidth={2.5} />

                            {/* SONI (DOIRA) */}
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-gold shadow-lg">
                                {cartCount}
                            </span>

                            {/* HOVER YORDAMCHI YOZUV */}
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-bold px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest border border-white/10 shadow-2xl">
                                Саватчага ўтиш
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}