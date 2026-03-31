"use client";
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/product/${product.id}`} className="group">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Rasm yo'q</div>
                )}

                {/* Badge: Yangi yoki Kategoriya */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.is_new && (
                        <span className="bg-brand-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">NEW</span>
                    )}
                    <span className="bg-white/80 dark:bg-black/50 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest dark:text-white">
                        {product.category}
                    </span>
                </div>

                {/* Tezkor qo'shish tugmasi (Hover bo'lganda chiqadi) */}
                <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-full py-3 bg-white dark:bg-black dark:text-white text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                        <ShoppingBag size={14} /> Ko'rish
                    </button>
                </div>
            </div>

            <div className="px-2">
                <h3 className="font-black text-sm uppercase italic dark:text-white truncate tracking-tighter mb-1">
                    {product.name}
                </h3>
                <p className="text-brand-gold font-black text-lg">
                    {Number(product.price).toLocaleString()} <span className="text-[10px] ml-1">SOM</span>
                </p>
            </div>
        </Link>
    );
}