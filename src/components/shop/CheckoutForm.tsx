"use client";
import React, { useState } from 'react';
import { useCart } from '../../../store/useCart';
import { Send, ArrowLeft } from 'lucide-react';

export default function CheckoutForm({ onBack }: { onBack: () => void }) {
    const { items, total } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleSendWhatsApp = () => {
        if (!formData.name || !formData.phone || !formData.address) {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        // Savatdagi mahsulotlarni matn ko'rinishiga keltiramiz
        const productList = items
            .map((item) => `- ${item.name} (${item.size}): ${item.quantity} dona`)
            .join('%0A'); // %0A - bu WhatsApp uchun yangi qator

        const message = `Yangi buyurtma (ATU SHOP):%0A%0A` +
            `👤 Mijoz: ${formData.name}%0A` +
            `📞 Tel: ${formData.phone}%0A` +
            `📍 Manzil: ${formData.address}%0A%0A` +
            `📦 Mahsulotlar:%0A${productList}%0A%0A` +
            `💰 Jami summa: ${total().toLocaleString()} KGS`;

        // Kelajakda raqamni shu yerga qo'yamiz (hozircha namunaviy)
        const whatsappNumber = "996555123456";
        window.open(`https://wa.me{whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-brand-gold">
                <ArrowLeft size={18} /> Orqaga savatga
            </button>

            <h3 className="text-xl font-black dark:text-white uppercase italic mb-6">Ma'lumotlaringizni kiriting</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Ism va Familiya</label>
                    <input
                        type="text"
                        placeholder="Ali Valiyev"
                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl py-4 px-6 dark:text-white focus:ring-2 ring-brand-gold transition-all"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Telefon raqami</label>
                    <input
                        type="tel"
                        placeholder="+996 --- --- ---"
                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl py-4 px-6 dark:text-white focus:ring-2 ring-brand-gold transition-all"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Yetkazib berish manzili</label>
                    <textarea
                        rows={3}
                        placeholder="Shahar, tuman, ko'cha, uy raqami..."
                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl py-4 px-6 dark:text-white focus:ring-2 ring-brand-gold transition-all resize-none"
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                </div>
            </div>

            <button
                onClick={handleSendWhatsApp}
                className="mt-auto bg-green-500 hover:bg-green-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/20"
            >
                <Send size={20} />
                WhatsApp orqali tasdiqlash
            </button>
        </div>
    );
}
