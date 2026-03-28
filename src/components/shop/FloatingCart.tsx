"use client";
import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ArrowLeft, Send } from 'lucide-react';
import { useCart } from '../../../store/useCart';

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const { items, removeItem, total } = useCart();
  
  // Checkout forma uchun state
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsApp = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Iltimos, ma'lumotlarni to'liq kiriting!");
      return;
    }
    const productList = items.map(i => `- ${i.name} (${i.size}): ${i.quantity} dona`).join('%0A');
    const msg = `Yangi buyurtma (ATU SHOP):%0A%0A👤 Mijoz: ${formData.name}%0A📞 Tel: ${formData.phone}%0A📍 Manzil: ${formData.address}%0A%0A📦 Mahsulotlar:%0A${productList}%0A%0A💰 Jami: ${total().toLocaleString()} KGS`;
    window.open(`https://wa.me{msg}`, '_blank'); // Raqamni keyin o'zgartiramiz
  };

  return (
    <>
      {/* 1. Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-brand-gold text-black p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-brand-black"
      >
        <div className="relative">
          <ShoppingBag size={28} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-gold">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* 2. Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-brand-black h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-black italic dark:text-white uppercase">
                {step === 'cart' ? 'Savat' : 'Buyurtma berish'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 dark:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'cart' ? (
                /* SAVAT RO'YXATI */
                items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingBag size={64} className="mb-4 opacity-20" />
                    <p>Savat bo'sh</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5"><img src={item.image[0]} className="w-full h-full object-cover" /></div>
                        <div className="flex-1">
                          <h4 className="font-bold dark:text-white text-sm uppercase">{item.name}</h4>
                          <p className="text-xs text-brand-gold font-bold">O'lcham: {item.size}</p>
                          <div className="flex justify-between mt-2">
                            <span className="font-black dark:text-white">{item.price.toLocaleString()} KGS</span>
                            <button onClick={() => removeItem(item.id, item.size)} className="text-red-500"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* CHECKOUT FORMA */
                <div className="space-y-6 animate-in fade-in">
                  <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-gray-400 text-sm mb-4"><ArrowLeft size={16}/> Savatga qaytish</button>
                  <input placeholder="Ismingiz" className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-2xl dark:text-white" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input placeholder="Telefon (+996...)" className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-2xl dark:text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <textarea placeholder="Manzil" rows={3} className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-2xl dark:text-white" onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <div className="flex justify-between mb-6">
                  <span className="text-gray-500 font-bold uppercase text-xs">Jami:</span>
                  <span className="text-2xl font-black text-brand-gold">{total().toLocaleString()} KGS</span>
                </div>
                {step === 'cart' ? (
                  <button onClick={() => setStep('checkout')} className="w-full bg-black dark:bg-brand-gold text-white dark:text-black py-5 rounded-[1.5rem] font-black uppercase">Sotib olish</button>
                ) : (
                  <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white py-5 rounded-[1.5rem] font-black uppercase flex items-center justify-center gap-2"><Send size={20}/> WhatsApp-da tasdiqlash</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
