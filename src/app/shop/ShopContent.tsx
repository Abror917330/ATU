"use client";
import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';

export default function ShopContent({ products }: { products: any[] }) {
    const [activeMain, setActiveMain] = useState('all');
    const [activeSub, setActiveSub] = useState('all');
    const [searchQuery, setSearchQuery] = useState(''); // Smart qidiruv uchun

    // Baza tozalanishigacha eski mahsulotlar yo'qolmasligi uchun himoya
    const safeProducts = products.map(p => ({
        ...p,
        main_category: p.main_category || 'универсал',
        sub_category: p.sub_category || 'бошқалар'
    }));

    const mainCategories = useMemo(() => {
        const dbMains = safeProducts.map(p => p.main_category);
        return Array.from(new Set([...Object.keys(DEFAULT_CATEGORIES), ...dbMains])).filter(Boolean);
    }, [safeProducts]);

    const subCategories = useMemo(() => {
        if (activeMain === 'all') return [];
        const dbSubs = safeProducts.filter(p => p.main_category === activeMain).map(p => p.sub_category);
        const defaultSubs = DEFAULT_CATEGORIES[activeMain] || [];
        return Array.from(new Set([...defaultSubs, ...dbSubs])).filter(Boolean);
    }, [activeMain, safeProducts]);

    const finalProducts = useMemo(() => {
        return safeProducts.filter(p => {
            const matchMain = activeMain === 'all' || p.main_category === activeMain;
            const matchSub = activeSub === 'all' || p.sub_category === activeSub;
            // Qidiruv bo'yicha filter (Keyingi bosqich: Fuzzy search uchun tayyor baza)
            const matchSearch = (p.name || p.sub_category).toLowerCase().includes(searchQuery.toLowerCase());
            return matchMain && matchSub && matchSearch;
        });
    }, [safeProducts, activeMain, activeSub, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* SEARCH INPUT */}
            <div className="mb-6">
                <Input
                    icon={<Search size={20} />}
                    placeholder="Маҳсулот қидириш..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* 🔴 ASOSIY KATEGORIYALAR */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
                <button onClick={() => { setActiveMain('all'); setActiveSub('all'); }} className={`px-6 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase whitespace-nowrap transition-all ${activeMain === 'all' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-white/5 text-gray-500'}`}>Барчаси</button>
                {mainCategories.map(cat => (
                    <button key={cat} onClick={() => { setActiveMain(cat); setActiveSub('all'); }} className={`px-6 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase whitespace-nowrap transition-all ${activeMain === cat ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* 🟡 ICHKI KATEGORIYALAR */}
            {activeMain !== 'all' && subCategories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                    <button onClick={() => setActiveSub('all')} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${activeSub === 'all' ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-transparent text-gray-400 bg-white dark:bg-white/5'}`}>Ҳаммаси</button>
                    {subCategories.map(sub => (
                        <button key={sub} onClick={() => setActiveSub(sub)} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${activeSub === sub ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-transparent text-gray-400 bg-white dark:bg-white/5'}`}>
                            {sub}
                        </button>
                    ))}
                </div>
            )}

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {finalProducts.length > 0 ? (
                    finalProducts.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase text-sm">
                        {searchQuery ? "Қидирув бўйича маҳсулот топилмади" : "Маҳсулот топилмади"}
                    </div>
                )}
            </div>
        </div>
    );
}