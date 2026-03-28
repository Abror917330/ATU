"use client";
import React, { useState } from 'react';
import { useCart } from '../../..//store/useCart';
import { ShoppingBag, Star } from 'lucide-react';

// Mahsulot strukturasi (Xatolarni oldini olish uchun)
interface ProductType {
    id: string;
    name: string;
    price: number;
    images: string[];
    sizes: string[];
    description: string;
}

// Komponentni Props bilan e'lon qilish
export default function ProductDetails({ product }: { product: ProductType }) {
    const [activeImg, setActiveImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const addItem = useCart((state) => state.addItem);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* RASMLAR GALEREYASI */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
                <div className="flex md:flex-col gap-3 overflow-x-auto">
                    {product.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImg(idx)}
                            className={`flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-brand-gold scale-95' : 'border-transparent opacity-50'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="thumb" />
                        </button>
                    ))}
                </div>

                <div className="flex-1 aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative">
                    <img
                        src={product.images[activeImg]}
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                        alt={product.name}
                    />
                </div>
            </div>

            {/* MA'LUMOTLAR VA SOMDA NARX */}
            <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-black dark:text-white uppercase italic tracking-tighter mb-2">
                    {product.name}
                </h1>

                {/* Valyuta: KGS */}
                <p className="text-3xl font-bold text-brand-gold mb-6">
                    {product.price.toLocaleString()} <span className="text-sm">KGS</span>
                </p>

                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">O'lcham (Size)</p>
                    <div className="flex gap-3">
                        {product.sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-14 h-14 rounded-2xl border-2 font-black transition-all ${selectedSize === size
                                        ? 'bg-brand-gold border-brand-gold text-black shadow-lg scale-110'
                                        : 'border-gray-200 dark:border-white/10 dark:text-white hover:border-brand-gold'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0], // Birinchi rasm savat uchun
                        size: selectedSize,
                        quantity: 1
                    })}
                    className="group flex items-center justify-center gap-4 bg-black dark:bg-brand-gold text-white dark:text-black py-6 rounded-[2rem] font-black uppercase transition-all hover:shadow-2xl active:scale-95"
                >
                    <ShoppingBag size={20} />
                    Savatga qo'shish
                </button>
            </div>
        </div>
    );
}
