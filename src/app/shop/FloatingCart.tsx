"use client";
import { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, MessageCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/../store/useCart';
import { usePathname } from 'next/navigation';

const formatPrice = (price: number) =>
    new Intl.NumberFormat('ky-KG').format(price) + ' som';

const WHATSAPP = "996223555539";

export default function FloatingCart() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [sending, setSending] = useState(false);
    const pathname = usePathname();

    if (!pathname.includes('/shop')) return null;

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    const handleWhatsAppOrder = () => {
        if (!form.name || !form.phone) return;
        setSending(true);

        const itemsList = items.map((item, idx) =>
            `${idx + 1}. *${item.name}*` +
            (item.size ? `\n   Razmer: ${item.size}` : '') +
            (item.color ? `\n   Rang: ${item.color}` : '') +
            `\n   Soni: ${item.quantity} ta` +
            `\n   Narxi: ${formatPrice(item.price * item.quantity)}`
        ).join('\n\n');

        const msg =
            `*YANGI BUYURTMA — ATU SHOP*\n\n` +
            `*Mijoz:* ${form.name}\n` +
            `*Tel:* ${form.phone}\n` +
            (form.address ? `*Manzil:* ${form.address}\n` : '') +
            `\n*Mahsulotlar:*\n${itemsList}\n\n` +
            `*JAMI: ${formatPrice(total())}*`;

        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');

        setTimeout(() => {
            clearCart();
            setIsOpen(false);
            setShowCheckout(false);
            setForm({ name: '', phone: '', address: '' });
            setSending(false);
        }, 500);
    };

    return (
        <>
            {/* FLOATING TUGMA */}
            {items.length > 0 && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-16 h-16 bg-brand-gold text-black rounded-full flex items-center justify-center shadow-2xl shadow-brand-gold/40 hover:scale-110 active:scale-95 transition-all"
                >
                    <ShoppingBag size={26} />
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-black text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-brand-gold">
                        {itemCount}
                    </span>
                </button>
            )}

            {/* DRAWER */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999]">
                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => { setIsOpen(false); setShowCheckout(false); }}
                    />

                    {/* PANEL */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-brand-black flex flex-col shadow-2xl">

                        {/* HEADER */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <h2 className="font-black text-xl dark:text-white uppercase italic tracking-tighter">
                                    Savatcha
                                </h2>
                                {itemCount > 0 && (
                                    <span className="bg-brand-gold text-black text-xs font-black px-2.5 py-1 rounded-full">
                                        {itemCount} ta
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {items.length > 0 && (
                                    <button
                                        onClick={() => { if (confirm("Savatni tozalash?")) clearCart(); }}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Savatni tozalash"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => { setIsOpen(false); setShowCheckout(false); }}
                                    className="p-2 bg-gray-100 dark:bg-white/10 rounded-full dark:text-white hover:rotate-90 transition-all"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={40} className="text-gray-300 dark:text-white/20" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-gray-400 uppercase italic text-lg">Savat bo'sh</p>
                                        <p className="text-gray-300 text-sm mt-1">Mahsulot qo'shing</p>
                                    </div>
                                </div>
                            ) : (
                                items.map((item, i) => (
                                    <div
                                        key={`${item.id}-${item.size}-${item.color}-${i}`}
                                        className="flex gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl p-3 border border-transparent hover:border-brand-gold/20 transition-all"
                                    >
                                        {/* RASM */}
                                        <div className="w-18 h-18 bg-gray-200 dark:bg-white/10 rounded-xl overflow-hidden shrink-0 w-[72px] h-[72px]">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag size={24} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* INFO */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm dark:text-white uppercase truncate leading-tight">
                                                {item.name}
                                            </p>
                                            <div className="flex gap-1.5 mt-1 flex-wrap">
                                                {item.size && (
                                                    <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-lg font-black">
                                                        {item.size}
                                                    </span>
                                                )}
                                                {item.color && (
                                                    <span className="text-[10px] bg-gray-200 dark:bg-white/10 dark:text-gray-300 px-2 py-0.5 rounded-lg font-black">
                                                        {item.color}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-brand-gold font-black text-sm mt-1.5">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>

                                        {/* AMALLAR */}
                                        <div className="flex flex-col items-end justify-between shrink-0">
                                            <button
                                                onClick={() => removeItem(item.id, item.size, item.color)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <X size={16} />
                                            </button>

                                            <div className="flex items-center gap-2 bg-white dark:bg-black/30 rounded-full px-1 py-1 border border-gray-200 dark:border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                                    className="w-6 h-6 flex items-center justify-center dark:text-white hover:text-brand-gold transition-colors"
                                                >
                                                    <Minus size={13} />
                                                </button>
                                                <span className="text-sm font-black dark:text-white w-5 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                                    className="w-6 h-6 flex items-center justify-center dark:text-white hover:text-brand-gold transition-colors"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* JAMI + BUYURTMA */}
                        {items.length > 0 && (
                            <div className="px-5 py-5 border-t border-gray-100 dark:border-white/10">
                                {/* JAMI */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Jami summa:
                                    </span>
                                    <span className="font-black text-brand-gold text-2xl italic">
                                        {formatPrice(total())}
                                    </span>
                                </div>

                                {/* CHECKOUT FORMA */}
                                {!showCheckout ? (
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full py-4 bg-brand-gold text-black font-black rounded-2xl uppercase italic tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-brand-gold/20 hover:scale-[1.02] active:scale-95 transition-all text-base"
                                    >
                                        <MessageCircle size={20} />
                                        Buyurtma berish
                                    </button>
                                ) : (
                                    <div className="space-y-2.5">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                            Ma'lumotlarni kiriting
                                        </p>
                                        <input
                                            placeholder="Ismingiz *"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-gray-100 dark:bg-white/5 dark:text-white border border-transparent focus:border-brand-gold rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium"
                                        />
                                        <input
                                            placeholder="Telefon raqam * (+996...)"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            type="tel"
                                            className="w-full bg-gray-100 dark:bg-white/5 dark:text-white border border-transparent focus:border-brand-gold rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium"
                                        />
                                        <input
                                            placeholder="Manzil (ixtiyoriy)"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            className="w-full bg-gray-100 dark:bg-white/5 dark:text-white border border-transparent focus:border-brand-gold rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium"
                                        />

                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <button
                                                onClick={() => setShowCheckout(false)}
                                                className="py-3.5 bg-gray-100 dark:bg-white/10 dark:text-white font-black rounded-2xl text-sm uppercase hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                                            >
                                                Orqaga
                                            </button>
                                            <button
                                                onClick={handleWhatsAppOrder}
                                                disabled={!form.name || !form.phone || sending}
                                                className="py-3.5 bg-[#25D366] text-white font-black rounded-2xl text-sm uppercase flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-500/20"
                                            >
                                                <MessageCircle size={16} />
                                                {sending ? 'Yuborildi!' : 'WhatsApp'}
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