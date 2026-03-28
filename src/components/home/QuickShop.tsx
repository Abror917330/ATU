"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useFavorites } from '@/../store/useFavorites';

function ProductMiniCard({ product }: { product: any }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [imgError, setImgError] = useState(false);
    const { toggleShop, isShopFaved } = useFavorites();

    useEffect(() => setMounted(true), []);
    const faved = mounted && isShopFaved(product.id);

    const image = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : null;

    return (
        <div className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
            <div className="relative aspect-square">
                <div
                    onClick={() => router.push(`/shop/${product.id}`)}
                    className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-t-3xl overflow-hidden cursor-pointer"
                >
                    {image && !imgError ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={36} className="text-gray-300 dark:text-white/10" />
                        </div>
                    )}
                </div>

                {product.is_new && (
                    <span className="absolute top-2 left-2 z-10 bg-brand-gold text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase pointer-events-none">
                        Yangi
                    </span>
                )}

                <button
                    onClick={e => { e.stopPropagation(); toggleShop(product.id); }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white dark:bg-black/70 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                >
                    <Heart size={14} className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-white/50'} />
                </button>
            </div>

            <div onClick={() => router.push(`/shop/${product.id}`)} className="p-3 cursor-pointer">
                <h3 className="font-black text-xs dark:text-white uppercase truncate mb-1 group-hover:text-brand-gold transition-colors">
                    {product.name}
                </h3>
                {product.sizes && product.sizes.length > 0 && (
                    <div className="flex gap-1 mb-1.5 flex-wrap">
                        {product.sizes.slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[9px] bg-gray-100 dark:bg-white/10 dark:text-white px-1.5 py-0.5 rounded font-bold">
                                {s}
                            </span>
                        ))}
                    </div>
                )}
                <p className="text-brand-gold font-black text-sm">
                    {Number(product.price).toLocaleString()} som
                </p>
            </div>
        </div>
    );
}

export function QuickShop() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('in_stock', true)
                .order('created_at', { ascending: false })
                .limit(4);
            if (data) setProducts(data);
            if (error) console.error(error);
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
        </div>
    );

    if (products.length === 0) return (
        <section className="py-12 px-4 bg-gray-50 dark:bg-white/[0.02]">
            <div className="max-w-7xl mx-auto text-center py-10">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-bold text-sm">Mahsulotlar hali qo'shilmagan</p>
            </div>
        </section>
    );

    return (
        <section className="py-12 px-4 bg-gray-50 dark:bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[4px] mb-1">
                            Eng so'nggi
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white uppercase italic tracking-tighter">
                            ATU <span className="text-brand-gold">SHOP</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => router.push('/shop')}
                        className="flex items-center gap-2 text-xs font-black text-brand-gold hover:gap-3 transition-all uppercase tracking-widest"
                    >
                        Barchasi <ArrowRight size={14} />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {products.map(product => (
                        <ProductMiniCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}