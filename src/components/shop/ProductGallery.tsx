"use client";
import { useState } from 'react';

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
    const [active, setActive] = useState(0);
    const productImages = images?.length > 0 ? images : ['https://via.placeholder.com/800'];

    return (
        <div className="space-y-4">
            {/* ASOSIY KATTA RASM */}
            <div className="aspect-[4/5] md:aspect-square bg-gray-100 dark:bg-white/5 rounded-[2.5rem] overflow-hidden border dark:border-white/10 shadow-2xl">
                <img
                    src={productImages[active]}
                    className="w-full h-full object-cover transition-all duration-500"
                    alt={name}
                />
            </div>

            {/* KICHIK RASMLAR RO'YXATI */}
            {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide focus:outline-none">
                    {productImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActive(idx)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${active === idx ? 'border-brand-gold scale-105' : 'border-transparent opacity-60'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}