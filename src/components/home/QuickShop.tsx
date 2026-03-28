"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useFavorites } from '@/../store/useFavorites';

function ProductMiniCard({ product }: { product: any }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { toggleShop, isShopFaved } = useFavorites();

    useEffect(() => setMounted(true), []);
    const faved = mounted && isShopFaved(product.id);

    // Admin panel 'images' massivini ishlatgani uchun birinchisini olamiz
    const image = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '/placeholder.png';

    return (
        <div className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
            <div className="relative aspect-square">
                <div onClick={() => router.push(`/shop/${product.id}`)} className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-t-3xl overflow-hidden">
                    <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <button onClick={e => { e.stopPropagation(); toggleShop(product.id); }} className="absolute top-2 right-2 z-10 w-8 h-8 bg-white dark:bg-black/70 rounded-full flex items-center justify-center shadow-md">
                    <Heart size={14} className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-white/50'} />
                </button>
            </div>
            <div onClick={() => router.push(`/shop/${product.id}`)} className="p-3">
                <h3 className="font-black text-xs dark:text-white uppercase truncate mb-1">{product.name}</h3>
                <p className="text-brand-gold font-black text-sm">{product.price?.toLocaleString()} KGS</p>
            </div>
        </div>
    );
}

export function QuickShop() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuickProducts = async () => {
            const { data } = await supabase
                .from('shop_products')
                .select('*')
                .eq('is_quick_shop', true) // Faqat tanlangan 4 tasi
                .limit(4);
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchQuickProducts();
    }, []);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>;
    if (products.length === 0) return null; // Agar tanlanmagan bo'lsa ko'rinmaydi

    return (
        <section className="py-12 px-4 bg-gray-50 dark:bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[4px] mb-1">Tanlanganlar</p>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white uppercase italic tracking-tighter">ATU <span className="text-brand-gold">SHOP</span></h2>
                    </div>
                    <button onClick={() => router.push('/shop')} className="flex items-center gap-2 text-xs font-black text-brand-gold hover:gap-3 transition-all uppercase tracking-widest">
                        Barchasi <ArrowRight size={14} />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {products.map(product => <ProductMiniCard key={product.id} product={product} />)}
                </div>
            </div>
        </section>
    );
}