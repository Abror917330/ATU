"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


function ProductCard({ product }: { product: any }) {
    const [currentImg, setCurrentImg] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ['https://via.placeholder.com/400'];

    // --- AVTOMATIK ALMASHISH MANTIQI ---
    useEffect(() => {
        let interval: any;

        // Agar rasmlar 1 tadan ko'p bo'lsa va sichqoncha ustida bo'lmasa (ixtiyoriy)
        // Avtomatik aylanishni boshlaymiz
        if (images.length > 1) {
            interval = setInterval(() => {
                setCurrentImg((prev) => (prev + 1) % images.length);
            }, 3500); // Har 3.5 soniyada o'zgaradi
        }

        return () => clearInterval(interval); // Komponent yopilganda taymerni to'xtatish
    }, [images.length]);
    // -----------------------------------

    if (!product) return null;

    return (
        <div
            className="group bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-brand-gold/50 transition-all duration-500 shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/shop/${product.id}`}>
                <div className="aspect-square overflow-hidden relative">
                    <img
                        src={images[currentImg]}
                        alt={product.name || ""}
                        className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
                    />

                    {/* Qaysi rasmda turganini ko'rsatuvchi chiziqchalar */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-10">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-500 ${currentImg === idx ? 'bg-brand-gold w-4' : 'bg-white/30 w-1'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Rasm almashayotganda yengil effekt (optional) */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <div className="p-4 sm:p-5">
                    <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-1">
                        {product.sub_category || product.main_category}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate mb-2">
                        {product.name || product.sub_category}
                    </h3>
                    <p className="text-brand-gold font-black text-sm sm:text-lg">
                        {Number(product.price || 0).toLocaleString('ru-RU')} <span className="text-[10px] opacity-70 text-gray-400">SOM</span>
                    </p>
                </div>
            </Link>
        </div>
    );
}