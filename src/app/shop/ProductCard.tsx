"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart } from 'lucide-react';
import { useFavorites } from '@/../store/useFavorites';

// Narxni formatlash funksiyasi (agar lib ichida bo'lsa shuni ishlating)
const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export default function ProductCard({ product }: { product: any }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { toggleShop, isShopFaved } = useFavorites();

    useEffect(() => setMounted(true), []);
    const faved = mounted && isShopFaved(product.id);

    return (
        <div className="group cursor-pointer bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
            <div className="relative aspect-square overflow-hidden rounded-t-[2rem]">
                <img
                    onClick={() => router.push(`/shop/${product.id}`)}
                    src={product.images[0]} // Birinchi rasm
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                    onClick={e => { e.stopPropagation(); toggleShop(product.id); }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                >
                    <Heart size={16} className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-brand-gold text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Yangi</span>
                )}
            </div>

            <div onClick={() => router.push(`/shop/${product.id}`)} className="p-4">
                <h3 className="font-black text-sm dark:text-white uppercase truncate mb-1">{product.name}</h3>
                <p className="text-brand-gold font-black text-base">{formatPrice(product.price)}</p>

                {/* Razmerlar preview */}
                <div className="flex gap-1 mt-2">
                    {product.sizes?.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[9px] bg-gray-100 dark:bg-white/10 dark:text-gray-400 px-1.5 py-0.5 rounded-md font-bold">{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}