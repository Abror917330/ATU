"use client";
import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Save, Check, Settings2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Dastlabki tizim kategoriyalari
const SYSTEM_MAIN_CATS = [
    { id: 'clothes', label: 'Kiyimlar', type: 'auto' },
    { id: 'shoes', label: 'Oyoq kiyimlar', type: 'auto' }
];

const AUTO_SIZES = {
    clothes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    shoes: ['38', '39', '40', '41', '42', '43', '44', '45']
};

export default function ProductForm({ editingId, form, setForm, onSubmit, onReset, loading }: any) {
    const [uploading, setUploading] = useState(false);
    const [showNewMainCat, setShowNewMainCat] = useState(false);
    const [newMainCatInput, setNewMainCatInput] = useState('');
    const [customMainCats, setCustomMainCats] = useState<any[]>([]);
    const [tempSubCat, setTempSubCat] = useState('');

    // Barcha asosiy kategoriyalar (System + User)
    const allMainCats = [...SYSTEM_MAIN_CATS, ...customMainCats];

    // Asosiy kategoriya o'zgarganda mantiq
    const handleMainCatChange = (cat: any) => {
        let initialSizes: string[] = [];
        if (cat.id === 'clothes') initialSizes = AUTO_SIZES.clothes;
        if (cat.id === 'shoes') initialSizes = AUTO_SIZES.shoes;

        setForm({
            ...form,
            main_category: cat.id,
            category: '', // Ichki kategoriya reset
            sizes: initialSizes
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        for (const file of files) {
            try {
                const ext = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
                const { data, error } = await supabase.storage.from('shop-images').upload(`products/${fileName}`, file);
                if (data) {
                    const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(data.path);
                    setForm((prev: any) => ({ ...prev, images: [...prev.images, urlData.publicUrl] }));
                }
            } catch (err) { console.error(err); }
        }
        setUploading(false);
    };

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <Settings2 className="text-brand-gold" />
                <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter">
                    {editingId ? "Tahrirlash" : "Yangi Mahsulot Kontentini boshqarish"}
                </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* 1-USTUN: MEDIA VA KATEGORIYALAR */}
                <div className="space-y-8">
                    {/* ASOSIY KATEGORIYA (Kiyim, Oyoq kiyim, Texnika...) */}
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[3px] mb-4">1. Asosiy Bo'lim</p>
                        <div className="flex flex-wrap gap-3">
                            {allMainCats.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleMainCatChange(cat)}
                                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all ${form.main_category === cat.id ? 'bg-brand-gold text-black scale-105 shadow-lg' : 'bg-gray-100 dark:bg-white/5 dark:text-white hover:bg-gray-200'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                            {showNewMainCat ? (
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        value={newMainCatInput}
                                        onChange={e => setNewMainCatInput(e.target.value)}
                                        placeholder="Yangi bo'lim..."
                                        className="bg-brand-gold/10 border border-brand-gold/30 text-xs font-bold p-3 rounded-2xl outline-none dark:text-white"
                                    />
                                    <button onClick={() => {
                                        if (newMainCatInput) {
                                            setCustomMainCats([...customMainCats, { id: newMainCatInput.toLowerCase(), label: newMainCatInput, type: 'manual' }]);
                                            setNewMainCatInput('');
                                            setShowNewMainCat(false);
                                        }
                                    }} className="bg-green-500 text-white p-3 rounded-2xl"><Check size={18} /></button>
                                </div>
                            ) : (
                                <button onClick={() => setShowNewMainCat(true)} className="p-3 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl text-gray-400 hover:border-brand-gold transition-all">
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ICHKI KATEGORIYA (Futbolka, Shim yoki Zaryadka, Chixol...) */}
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[3px] mb-4">2. Ichki Kategoriya</p>
                        <div className="flex gap-2">
                            <input
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                placeholder="Masalan: Futbolka yoki Chixol..."
                                className="flex-1 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl font-bold outline-none dark:text-white border border-transparent focus:border-brand-gold/30"
                            />
                        </div>
                    </div>

                    {/* RASMLAR */}
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[3px] mb-4">3. Rasmlar</p>
                        <div className="grid grid-cols-4 gap-3">
                            {form.images.map((img: string, i: number) => (
                                <div key={i} className="relative aspect-square rounded-3xl overflow-hidden group border border-gray-100 dark:border-white/10">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={() => setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) })} className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"><X size={20} /></button>
                                </div>
                            ))}
                            {form.images.length < 5 && (
                                <label className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all text-gray-400">
                                    {uploading ? <Loader2 className="animate-spin text-brand-gold" /> : <><Plus /><span className="text-[9px] font-black mt-1">QO'SHISH</span></>}
                                    <input type="file" hidden multiple onChange={handleUpload} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2-USTUN: NARX VA RAZMERLAR */}
                <div className="space-y-6">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mahsulotning to'liq nomi" className="w-full bg-gray-50 dark:bg-white/5 p-5 rounded-3xl font-black text-lg outline-none dark:text-white border border-transparent focus:border-brand-gold/30" />

                    <div className="relative">
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Narxi" className="w-full bg-gray-50 dark:bg-white/5 p-5 rounded-3xl font-black text-2xl outline-none text-brand-gold border border-transparent focus:border-brand-gold/30" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400">SOM</span>
                    </div>

                    {/* RAZMERLARNI BOSHQARISH */}
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-[3px] mb-4">O'lchamlar / Parametrlar</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {form.sizes.map((s: string, i: number) => (
                                <span key={i} className="pl-4 pr-2 py-2 bg-white dark:bg-white/10 dark:text-white rounded-xl text-xs font-black flex items-center gap-3 border dark:border-white/5">
                                    {s}
                                    <button onClick={() => setForm({ ...form, sizes: form.sizes.filter((x: string) => x !== s) })} className="hover:text-red-500 p-1"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={tempSubCat}
                                onChange={e => setTempSubCat(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { setForm({ ...form, sizes: [...form.sizes, tempSubCat] }); setTempSubCat(''); } }}
                                placeholder="Yangi parametr qo'shish..."
                                className="flex-1 bg-white dark:bg-white/10 p-4 rounded-2xl outline-none text-sm dark:text-white"
                            />
                            <button onClick={() => { if (tempSubCat) { setForm({ ...form, sizes: [...form.sizes, tempSubCat] }); setTempSubCat('') } }} className="bg-brand-gold px-6 rounded-2xl font-black transition-transform active:scale-90"><Plus size={24} /></button>
                        </div>
                    </div>

                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mahsulot haqida qisqacha ma'lumot..." rows={3} className="w-full bg-gray-50 dark:bg-white/5 p-5 rounded-3xl outline-none dark:text-white resize-none border border-transparent focus:border-brand-gold/30" />

                    <button onClick={onSubmit} disabled={loading || uploading} className="w-full py-6 bg-brand-gold text-black font-black rounded-3xl uppercase tracking-[2px] shadow-2xl shadow-brand-gold/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-3">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={22} /> SAQLASH VA JOYLASHTIRISH</>}
                    </button>
                </div>
            </div>
        </div>
    );
}