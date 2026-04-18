"use client";
import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const phoneNumber = "996507008466";

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(data);
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        const newCart = cartItems.map((item: any) => {
            if (item.id === id) {
                const newQty = Math.max(1, (item.quantity || 1) + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (id: string) => {
        const newCart = cartItems.filter((item: any) => item.id !== id);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage')); // Shop sahifasidagi raqamni yangilash uchun
    };

    const totalPrice = cartItems.reduce((sum, item: any) => sum + (Number(item.price) * (item.quantity || 1)), 0);

    const checkoutWhatsApp = () => {
        let text = "🚀 YANGI BUYURTMA:\n\n";
        cartItems.forEach((item: any, idx) => {
            text += `${idx + 1}. ${item.name} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString()} SOM\n`;
        });
        text += `\n💵 JAMI SUMMA: ${totalPrice.toLocaleString()} SOM`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (cartItems.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-500 uppercase">Саватча бўш</h2>
            <Link href="/shop" className="mt-4 px-8 py-3 bg-brand-gold text-black font-bold rounded-xl shadow-lg">Харидни бошлаsh</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-40">
            <div className="max-w-2xl mx-auto px-4 pt-24">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/shop" className="p-2 bg-white dark:bg-white/5 rounded-full shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Саватча</h1>
                </div>

                <div className="space-y-4">
                    {cartItems.map((item: any) => (
                        <div key={item.id} className="flex gap-4 bg-white dark:bg-white/5 p-3 rounded-[1.5rem] border dark:border-white/5 shadow-sm">
                            <img src={item.images?.[0]} className="w-24 h-24 object-cover rounded-[1rem]" />
                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <h3 className="font-bold text-sm dark:text-white line-clamp-1">{item.name}</h3>
                                    <p className="text-brand-gold font-black text-base">{Number(item.price).toLocaleString()} SOM</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500"><Minus size={16} /></button>
                                        <span className="font-bold text-sm dark:text-white">{item.quantity || 1}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500"><Plus size={16} /></button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PASTDAGI YOPISHQOQ PANEL */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t dark:border-white/5 p-6 pb-10 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Жами сумма</span>
                        <span className="text-2xl font-black text-brand-gold">{totalPrice.toLocaleString()} SOM</span>
                    </div>
                    <button 
                        onClick={checkoutWhatsApp}
                        className="w-full  mb-14   py-5 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 text-lg hover:shadow-xl active:scale-95 transition-all"
                    >
                        <MessageSquare size={22} /> WHATSAPP-DA TASDIQLASH
                    </button>
                </div>
            </div>
        </main>
    );
}