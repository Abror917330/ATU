"use client";
import { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingBag, Loader2 } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import FloatingCart from '@/components/shop/FloatingCart';
import { CATEGORIES } from '@/lib/shopData';
import { supabase } from '@/lib/supabase'; // Supabase ulanishi

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]); // Bazadan keladigan mahsulotlar
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');

    // BAZADAN MA'LUMOTNI TORTISH
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('shop_products')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchCat = activeCategory === 'all' || p.category === activeCategory;
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [activeCategory, search, products]);

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-7xl mx-auto px-4">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white">
                        ATU <span className="text-brand-gold">SHOP</span>
                    </h1>
                </div>

                {/* SEARCH */}
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Mahsulot qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 dark:text-white outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                </div>

                {/* KATEGORIYALAR */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-black transition-all ${activeCategory === cat.id ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* MAHSULOTLAR LISTI */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ShoppingBag size={48} className="text-gray-300 mb-2" />
                        <p className="text-gray-400 font-bold">Mahsulot topilmadi</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
            <FloatingCart />
        </main>
    );
}