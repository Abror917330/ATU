"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart } from 'lucide-react';
import { useFavorites } from '@/../store/useFavorites';

const formatPrice = (price: number) =>
    new Intl.NumberFormat('ky-KG').format(price) + ' som';

export default function ProductCard({ product }: { product: any }) {
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
        <div className="group cursor-pointer bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
            <div className="relative aspect-square">
                {/* RASM */}
                <div
                    onClick={() => router.push(`/shop/${product.id}`)}
                    className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-t-[2rem] overflow-hidden cursor-pointer"
                >
                    {image && !imgError ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={40} className="text-gray-300 dark:text-white/10" />
                        </div>
                    )}
                </div>

                {/* LIKE */}
                <button
                    onClick={e => { e.stopPropagation(); toggleShop(product.id); }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                    <Heart
                        size={16}
                        className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-white/50'}
                    />
                </button>

                {/* YANGI BADGE */}
                {product.is_new && (
                    <span className="absolute top-3 left-3 z-10 bg-brand-gold text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase pointer-events-none">
                        Yangi
                    </span>
                )}
            </div>

            <div onClick={() => router.push(`/shop/${product.id}`)} className="p-4 cursor-pointer">
                <h3 className="font-black text-sm dark:text-white uppercase truncate mb-1 group-hover:text-brand-gold transition-colors">
                    {product.name}
                </h3>
                <p className="text-brand-gold font-black text-base">
                    {formatPrice(product.price)}
                </p>
                {product.sizes?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {product.sizes.slice(0, 4).map((s: string) => (
                            <span key={s} className="text-[9px] bg-gray-100 dark:bg-white/10 dark:text-gray-400 px-1.5 py-0.5 rounded-md font-bold">
                                {s}
                            </span>
                        ))}
                        {product.sizes.length > 4 && (
                            <span className="text-[9px] text-gray-400 font-bold">+{product.sizes.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}