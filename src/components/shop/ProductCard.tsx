"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/shop/${product.id}`} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                {/* Rasm */}
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-duration-700"
                />
                {/* Narxi rasm ustida (Modern uslub) */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md p-3 rounded-2xl flex justify-between items-center border border-white/20">
                        <span className="text-xs font-bold dark:text-white uppercase truncate mr-2">{product.name}</span>
                        <span className="text-xs font-black text-brand-gold whitespace-nowrap">
                            {product.price.toLocaleString()} UZS
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
