"use client";
import { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail({ params, product: initialProduct }: any) {
    const [selectedSize, setSelectedSize] = useState('');
    const [activeImg, setActiveImg] = useState(0);
    const [product, setProduct] = useState(initialProduct);

    // Agar product prop orqali kelmasa (masalan, to'g'ridan-to'g'ri link bilan kirilsa)
    // Bu yerda loading holati juda muhim
    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
                <Loader2 className="animate-spin text-brand-gold mb-4" size={40} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Yuklanmoqda...</p>
            </div>
        );
    }

    // Rasmlar xavfsizligini tekshiramiz
    const images = product.images || [];
    const hasImages = images.length > 0;

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Orqaga qaytish */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
                    <ChevronLeft size={16} /> Orqaga qaytish
                </Link>

                <div className="grid lg:grid-cols-2 gap-16">

                    {/* 1-USTUN: RASM GALEREYASI */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative border dark:border-white/5">
                            {hasImages ? (
                                <img
                                    src={images[activeImg]}
                                    alt={product.name}
                                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-[10px]">
                                    Rasm mavjud emas
                                </div>
                            )}
                        </div>

                        {/* Kichik rasmlar (Thumbnails) */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                                {images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${activeImg === i ? 'border-brand-gold scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2-USTUN: MAHSULOT MA'LUMOTLARI */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-brand-gold/10 text-brand-gold font-black uppercase tracking-[3px] text-[10px] px-3 py-1 rounded-full">
                                    {product.main_category || 'Katalog'}
                                </span>
                                <span className="text-gray-400 font-bold uppercase tracking-[2px] text-[10px]">
                                    / {product.category}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic dark:text-white leading-[0.9] tracking-tighter">
                                {product.name}
                            </h1>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-brand-gold">
                                    {Number(product.price).toLocaleString()}
                                </span>
                                <span className="text-lg font-black text-brand-gold opacity-60">SOM</span>
                            </div>
                            <div className="mt-6 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border dark:border-white/5">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                    {product.description || "Ushbu eksklyuziv mahsulot haqida batafsil ma'lumot olish uchun biz bilan bog'laning."}
                                </p>
                            </div>
                        </div>

                        {/* O'LCHAMLAR */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-10">
                                <p className="text-[10px] font-black uppercase tracking-[3px] mb-5 dark:text-white/40">O'lchamni tanlang</p>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[60px] h-[60px] px-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center border-2 ${selectedSize === size
                                                    ? 'bg-brand-gold border-brand-gold text-black scale-110 shadow-lg shadow-brand-gold/20'
                                                    : 'border-gray-100 dark:border-white/10 dark:text-white hover:border-brand-gold/50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* HARAKATLAR */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-[2] py-6 bg-brand-gold text-black font-black rounded-[1.5rem] uppercase tracking-[3px] flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-brand-gold/30">
                                <ShoppingBag size={22} /> Savatga qo'shish
                            </button>

                            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] border dark:border-white/5">
                                <div className="p-2 bg-green-500/10 rounded-full">
                                    <ShieldCheck className="text-green-500" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black dark:text-white uppercase">Original</span>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Kafolatlangan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}