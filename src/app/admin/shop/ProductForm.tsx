"use client";
import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Loader2, Save, Image as ImageIcon, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_CATEGORIES, SIZES_CLOTHES, SIZES_SHOES } from '@/lib/constants';
import Input from '@/components/ui/Input';

export default function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [isAddingMain, setIsAddingMain] = useState(false);
    const [isAddingSub, setIsAddingSub] = useState(false);

    const [form, setForm] = useState({
        name: '', price: '', images: [] as string[],
        main_category: '', sub_category: '', custom_main: '', custom_sub: '',
        sizes: [] as string[], delivery_time: '1-2 кун'
    });

    // Bazadan mavjud kategoriyalarni olish (Yangi qo'shilganlar saqlanib qolishi uchun)
    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase.from('products').select('main_category, sub_category');
            if (data) setDbCategories(data);
        };
        fetchCats();
    }, []);

    const mergedMainCats = useMemo(() => Array.from(new Set([...Object.keys(DEFAULT_CATEGORIES), ...dbCategories.map(p => p.main_category)])).filter(Boolean), [dbCategories]);
    const mergedSubCats = useMemo(() => {
        if (!form.main_category) return [];
        const dbSubs = dbCategories.filter(p => p.main_category === form.main_category).map(p => p.sub_category);
        return Array.from(new Set([...(DEFAULT_CATEGORIES[form.main_category] || []), ...dbSubs])).filter(Boolean);
    }, [form.main_category, dbCategories]);

    const handleMainCatChange = (val: string) => {
        let autoSizes: string[] = [];
        if (val.toLowerCase().includes('кийим') && !val.includes('оёқ')) autoSizes = SIZES_CLOTHES;
        if (val.toLowerCase().includes('оёқ кийим')) autoSizes = SIZES_SHOES;
        setForm({ ...form, main_category: val, sub_category: '', custom_main: '', sizes: autoSizes });
        setIsAddingMain(false);
    };

    const handleUpload = async (e: any) => {
        setUploading(true);
        for (const file of e.target.files) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data } = await supabase.storage.from('shop-images').upload(fileName, file);
            if (data) {
                const { data: url } = supabase.storage.from('shop-images').getPublicUrl(data.path);
                setForm(p => ({ ...p, images: [...p.images, url.publicUrl] }));
            }
        }
        setUploading(false);
    };

    const handleSubmit = async () => {
        if (!form.price) return alert("Нархни киритинг!");
        setLoading(true);

        const finalMain = form.custom_main || form.main_category || 'универсал';
        const finalSub = form.custom_sub || form.sub_category || 'бошқалар';

        await supabase.from('products').insert([{
            name: form.name || finalSub,
            price: Number(form.price),
            images: form.images,
            main_category: finalMain,
            sub_category: finalSub,
            sizes: form.sizes,
            delivery_time: form.delivery_time
        }]);

        setLoading(false);
        alert("Сақланди!");
        if (onSuccess) onSuccess();
    };

    return (
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl shadow-xl border dark:border-white/10">
            <h2 className="text-xl font-black mb-6 uppercase text-brand-gold">Маҳсулот қўшиш</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* KATEGORIYALAR (SHOP UI STYLING) */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">1. Асосий бўлим (🔴)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {mergedMainCats.map(c => (
                                <button key={c} onClick={() => handleMainCatChange(c)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${form.main_category === c ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                    {c}
                                </button>
                            ))}
                            <button onClick={() => setIsAddingMain(true)} className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-brand-gold/20 text-brand-gold">+ Янги</button>
                        </div>
                        {isAddingMain && <Input autoFocus placeholder="Янги бўлим номи..." onChange={e => setForm({ ...form, custom_main: e.target.value })} />}
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">2. Ички бўлим (🟡)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {mergedSubCats.map(c => (
                                <button key={c} onClick={() => { setForm({ ...form, sub_category: c }); setIsAddingSub(false); }} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${form.sub_category === c ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                    {c}
                                </button>
                            ))}
                            {form.main_category && <button onClick={() => setIsAddingSub(true)} className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-brand-gold/20 text-brand-gold">+ Янги</button>}
                        </div>
                        {isAddingSub && <Input autoFocus placeholder="Янги ички бўлим..." onChange={e => setForm({ ...form, custom_sub: e.target.value })} />}
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">3. Ўлчамлар (🟢 Ихтиёрий)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.sizes.map(s => (
                                <span key={s} className="bg-brand-gold text-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">{s} <X size={12} className="cursor-pointer" onClick={() => setForm({ ...form, sizes: form.sizes.filter(x => x !== s) })} /></span>
                            ))}
                        </div>
                        <Input placeholder="Ўлчам ёзиб Enter босинг" onKeyDown={(e: any) => { if (e.key === 'Enter' && e.target.value) { e.preventDefault(); setForm({ ...form, sizes: [...form.sizes, e.target.value] }); e.target.value = ''; } }} />
                    </div>
                </div>

                {/* MA'LUMOTLAR */}
                <div className="space-y-4">
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Маҳсулот номи (Мажбурий эмас)" />
                    <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Нархи (Сўм)*" className="text-brand-gold font-black text-xl" />
                    <Input icon={<Truck size={18} />} value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })} placeholder="Етказиб бериш вақти (мас: 1 кун)" />

                    <div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {form.images.map((img, i) => (
                                <div key={i} className="w-20 h-20 relative rounded-xl overflow-hidden group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                                </div>
                            ))}
                            <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-gold">
                                {uploading ? <Loader2 className="animate-spin text-brand-gold" /> : <ImageIcon className="text-gray-400" />}
                                <input type="file" multiple hidden onChange={handleUpload} />
                            </label>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading || uploading} className="w-full py-4 bg-brand-gold text-black font-black rounded-xl uppercase tracking-widest flex justify-center gap-2 mt-4 hover:opacity-90">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> САҚЛАШ</>}
                    </button>
                </div>
            </div>
        </div>
    );
}