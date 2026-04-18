"use client";
import { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, Truck } from 'lucide-react';
import ProductGallery from './ProductGallery';

export default function ProductClient({ product }: { product: any }) {
    const [isLiked, setIsLiked] = useState(false);
    const phoneNumber = "996507008466";

    // WhatsApp xabari
    const sendToWhatsApp = () => {
        const message = `Салом! Мен мана бу маҳсулотни сотиб олмоқчиман:\n\n` +
            `📦 Маҳсулот: ${product.name}\n` +
            `💰 Нархи: ${Number(product.price).toLocaleString()} SOM\n` +
            `🔗 Линк: ${window.location.href}`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Savatchaga qo'shish
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.find((item: any) => item.id === product.id)) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                images: product.images
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert("Саватчага қўшилди! ✅");
        } else {
            alert("Бу маҳсулот саватчада бор.");
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* CHAP TOMON: GALEREYA */}
            <ProductGallery images={product.images || []} name={product.name} />

            {/* O'NG TOMON: MA'LUMOTLAR */}
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-3">
                            {product.main_category} / {product.sub_category}
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black dark:text-white leading-tight">
                            {product.name || product.sub_category}
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-3 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}
                    >
                        <Heart size={24} fill={isLiked ? "white" : "none"} />
                    </button>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-brand-gold">
                        {Number(product.price).toLocaleString('ru-RU')}
                    </span>
                    <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">SOM</span>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5 w-full" />



                {/* YETKAZIB BERISH VA O'LCHAMLAR */}
                <div className="space-y-4 pt-4">
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Truck className="text-brand-gold" size={18} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Етказиб бериш</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(product.delivery_options || ['1 кун']).map((opt: string) => (
                                <span key={opt} className="px-4 py-2 bg-white dark:bg-[#111] rounded-lg text-xs font-bold dark:text-white border dark:border-white/10 shadow-sm">
                                    {opt}
                                </span>
                            ))}
                        </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Мавжуд ўлчамлар</p>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s: string) => (
                                    <span key={s} className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm dark:text-white shadow-sm">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* ASOSIY TUGMALAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={addToCart}
                        className="flex items-center justify-center gap-3 py-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                    >
                        <ShoppingCart size={20} /> САВАТГА СОЛИШ
                    </button>

                    <button
                        onClick={sendToWhatsApp}
                        className="flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#25d366]/20"
                    >
                        <MessageCircle size={20} /> WHATSAPP-ДА ОЛИШ
                    </button>
                </div>
            </div>
        </div>
    );
}