"use client";
import { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '@/../store/useCart';
import { usePathname } from 'next/navigation';

export default function FloatingCart() {
    // DIQQAT: Bu yerda total funksiyasini chaqirib olganmiz
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const pathname = usePathname();

    if (!pathname.includes('/shop')) return null;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';

    const handleWhatsAppOrder = () => {
        const itemsList = items.map((i, index) => {
            const sizeInfo = i.size ? `\n   📏 Razmer: ${i.size}` : '';
            const colorInfo = i.color ? `\n   🎨 Rang: ${i.color}` : '';
            return `${index + 1}. ${i.name}${sizeInfo}${colorInfo}\n   🔢 Soni: ${i.quantity} dona\n   💰 Narxi: ${formatPrice(i.price * i.quantity)}`;
        }).join('\n\n');

        // BU YERDA: total() deb ishlatiladi
        const totalSum = total();

        const msg = `🛍 *YANGI BUYURTMA (ATU SHOP)*\n\n` +
            `👤 *Mijoz:* ${form.name}\n` +
            `📞 *Tel:* ${form.phone}\n` +
            `📍 *Manzil:* ${form.address || 'Ko\'rsatilmadi'}\n\n` +
            `📦 *Mahsulotlar:* \n${itemsList}\n\n` +
            `--- \n` +
            `💵 *UMUMIY SUMMA:* *${formatPrice(totalSum)}*\n\n` +
            `✅ Buyurtmani tasdiqlashingizni kutaman.`;

        const whatsappNumber = "996223555539";
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');

        clearCart();
        setIsOpen(false);
        setShowCheckout(false);
    };

    return (
        <>
            {items.length > 0 && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 md:bottom-8 z-40 w-16 h-16 bg-brand-gold text-black rounded-full flex items-center justify-center shadow-2xl shadow-brand-gold/40 hover:scale-110 active:scale-95 transition-all animate-bounce-subtle"
                >
                    <ShoppingBag size={28} />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-brand-gold">
                        {items.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[9999]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-brand-black flex flex-col shadow-2xl">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                            <h2 className="font-black text-xl dark:text-white uppercase italic tracking-tighter">Savatcha</h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full dark:text-white hover:rotate-90 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <ShoppingBag size={64} className="text-gray-200 dark:text-white/5" />
                                    <p className="text-gray-400 font-bold uppercase italic">Savat bo'sh</p>
                                </div>
                            ) : (
                                items.map((item, i) => (
                                    <div key={i} className="flex gap-4 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] p-4 border border-transparent hover:border-brand-gold/30 transition-all">
                                        <div className="w-20 h-20 bg-gray-200 dark:bg-white/10 rounded-2xl overflow-hidden shrink-0">
                                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm dark:text-white uppercase truncate">{item.name}</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {item.size && <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md font-bold">R: {item.size}</span>}
                                                {item.color && <span className="text-[10px] bg-gray-200 dark:bg-white/10 dark:text-gray-400 px-2 py-0.5 rounded-md font-bold">C: {item.color}</span>}
                                            </div>
                                            <p className="text-brand-gold font-black text-base mt-2">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <X size={18} />
                                            </button>
                                            <div className="flex items-center gap-3 bg-white dark:bg-black/40 rounded-full p-1 border dark:border-white/10">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)} className="w-7 h-7 flex items-center justify-center dark:text-white hover:text-brand-gold">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-black dark:text-white w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)} className="w-7 h-7 flex items-center justify-center dark:text-white hover:text-brand-gold">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">Umumiy summa:</span>
                                    {/* XATOLIK MANA SHU YERDA EDI: total() bo'lishi shart */}
                                    <span className="font-black text-brand-gold text-2xl italic">{formatPrice(total())}</span>
                                </div>

                                {!showCheckout ? (
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full py-5 bg-brand-gold text-black font-black rounded-2xl uppercase italic tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-brand-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        <MessageCircle size={22} /> Buyurtmani rasmiylashtirish
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            placeholder="Ismingiz"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 dark:text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 ring-brand-gold transition-all"
                                        />
                                        <input
                                            placeholder="Telefon raqamingiz"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 dark:text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 ring-brand-gold transition-all"
                                        />
                                        <input
                                            placeholder="Yetkazib berish manzili"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            className="w-full bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 dark:text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 ring-brand-gold transition-all"
                                        />
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <button onClick={() => setShowCheckout(false)} className="py-4 bg-gray-200 dark:bg-white/10 dark:text-white font-black rounded-2xl text-xs uppercase">
                                                Bekor qilish
                                            </button>
                                            <button
                                                onClick={handleWhatsAppOrder}
                                                disabled={!form.name || !form.phone}
                                                className="py-4 bg-green-500 text-white font-black rounded-2xl text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-green-500/20"
                                            >
                                                Yuborish <MessageCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}