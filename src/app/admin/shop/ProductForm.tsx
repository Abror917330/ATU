"use client";
import { useState, useEffect } from 'react';
import { X, Loader2, Save, Image as ImageIcon, Truck, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';

const DEFAULT_DELIVERIES = ['15 кун', '7 кун', '3 кун', '1 кун'];

const PRESET_SIZES: any = {
    clothing: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    shoes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    iphones: [
        '6', '6s', '6plus', '6splus', '7', '8', '7plus', '8plus', 'x', 'xs', 'xr', 'xsmax',
        '11', '11pro', '11promax', '12', '12pro', '12mini', '12promax',
        '13', '13pro', '13mini', '13promax', '14', '14pro', '14mini', '14promax',
        '15', '15pro', '15mini', '15promax', '16', '16pro', '16mini', '16promax',
        '17', '17pro', '17air', '17promax'
    ]
};

const CLOTHING_KEYWORDS = [
    'трико', 'ветровка', 'фудболка', 'спартивка', 'детский', 'худи',
    'тройка', 'двойка', 'кўйлак', 'куртка', 'кастюм', 'шим',
    'форма', 'бош кийим', 'ички кийим'
];

export default function ProductForm({ editingId, onSuccess }: { editingId?: string | null, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mainCats, setMainCats] = useState<string[]>([]);
    const [subCats, setSubCats] = useState<string[]>([]);
    const [isAddingMain, setIsAddingMain] = useState(false);
    const [isAddingSub, setIsAddingSub] = useState(false);

    const [form, setForm] = useState({
        name: '', price: '', images: [] as string[],
        main_category: '', sub_category: '',
        custom_main: '', custom_sub: '',
        sizes: [] as string[], delivery_options: ['15 кун'] as string[]
    });

    const [suggestedSizes, setSuggestedSizes] = useState<string[]>([]);

    useEffect(() => {
        fetchMainCategories();
        if (editingId) fetchProductData(editingId);
    }, [editingId]);

    useEffect(() => {
        const main = form.main_category?.toLowerCase() || "";
        const sub = form.sub_category?.toLowerCase() || "";

        if (main.includes('обув') || sub.includes('обув') || main.includes('пойафзал')) {
            setSuggestedSizes(PRESET_SIZES.shoes);
        } else if (sub.includes('чехол') || main.includes('аксессуар')) {
            setSuggestedSizes(PRESET_SIZES.iphones);
        } else if (CLOTHING_KEYWORDS.some(word => main.includes(word) || sub.includes(word))) {
            setSuggestedSizes(PRESET_SIZES.clothing);
        } else {
            setSuggestedSizes([]);
        }
    }, [form.main_category, form.sub_category]);

    async function fetchMainCategories() {
        const { data } = await supabase.from('main_cats').select('name');
        if (data) setMainCats(data.map(m => m.name));
    }

    async function fetchSubCategories(mainName: string) {
        const { data } = await supabase.from('sub_cats').select('name').eq('main_name', mainName);
        if (data) setSubCats(data.map(s => s.name));
    }

    async function fetchProductData(id: string) {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (data && !error) {
            setForm({
                name: data.name || '',
                price: data.price ? data.price.toString() : '',
                images: data.images || [],
                main_category: data.main_category || '',
                sub_category: data.sub_category || '',
                custom_main: '',
                custom_sub: '',
                sizes: Array.isArray(data.sizes) ? data.sizes : [],
                delivery_options: data.delivery_options || ['1 кун']
            });
            if (data.main_category) fetchSubCategories(data.main_category);
        }
        setLoading(false);
    }

    const handleMainSelect = (cat: string) => {
        setForm(prev => ({ ...prev, main_category: cat, sub_category: '' }));
        fetchSubCategories(cat);
        setIsAddingMain(false);
    };

    const toggleSize = (size: string) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageUpload = async (e: any) => {
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

    const handleSave = async () => {
        if (!form.price || (!form.main_category && !form.custom_main)) return alert("Нарх ва категория киритинг");
        setLoading(true);
        const finalMain = form.custom_main || form.main_category;
        const finalSub = form.custom_sub || form.sub_category;

        if (form.custom_main) await supabase.from('main_cats').upsert({ name: finalMain });
        if (form.custom_sub) await supabase.from('sub_cats').upsert({ main_name: finalMain, name: finalSub });

        const productData = {
            name: form.name,
            price: Number(form.price),
            images: form.images,
            category: finalMain, // XATOLIKNI TUZATISH: Bazadagi "category" ustuni uchun ma'lumot
            main_category: finalMain,
            sub_category: finalSub,
            sizes: form.sizes,
            delivery_options: form.delivery_options
        };

        const { error } = editingId
            ? await supabase.from('products').update(productData).eq('id', editingId)
            : await supabase.from('products').insert([productData]);

        if (!error) {
            alert("Сақланди!");
            onSuccess();
            setForm({ name: '', price: '', images: [], main_category: '', sub_category: '', custom_main: '', custom_sub: '', sizes: [], delivery_options: ['1 кун'] });
        } else {
            alert("Xatolik yuz berdi: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[2.5rem] border dark:border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase text-brand-gold">
                    {editingId ? "📝 Таҳрирлаш" : "➕ Янги Маҳсулот"}
                </h2>
                {editingId && (
                    <button onClick={() => onSuccess()} className="text-gray-500 hover:text-white flex items-center gap-2 font-bold text-xs uppercase">
                        <RotateCcw size={14} /> Бекор қилиш
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    {/* Main Cats */}
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block">🔴 Асосий бўлим</label>
                        <div className="flex flex-wrap gap-2">
                            {mainCats.map(c => (
                                <button key={c} type="button" onClick={() => handleMainSelect(c)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${form.main_category === c ? 'bg-brand-gold text-black border-brand-gold' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}>
                                    {c}
                                </button>
                            ))}
                            <button type="button" onClick={() => setIsAddingMain(!isAddingMain)} className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-gold text-brand-gold">{isAddingMain ? "×" : "+ Янги"}</button>
                        </div>
                        {isAddingMain && <Input className="mt-3" placeholder="Янги бўлим номи..." value={form.custom_main} onChange={e => setForm({ ...form, custom_main: e.target.value })} />}
                    </div>

                    {/* Sub Cats */}
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block">🟡 Ички бўлим</label>
                        <div className="flex flex-wrap gap-2">
                            {subCats.map(s => (
                                <button key={s} type="button" onClick={() => setForm({ ...form, sub_category: s })} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${form.sub_category === s ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}>
                                    {s}
                                </button>
                            ))}
                            <button type="button" onClick={() => setIsAddingSub(!isAddingSub)} className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-gold text-brand-gold">{isAddingSub ? "×" : "+ Янги"}</button>
                        </div>
                        {isAddingSub && <Input className="mt-3" placeholder="Янги ички бўлим..." value={form.custom_sub} onChange={e => setForm({ ...form, custom_sub: e.target.value })} />}
                    </div>

                    {/* Sizes Panel */}
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block tracking-widest">🟢 Тайёр ўлчамлар</label>

                        {suggestedSizes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white/[0.02] rounded-3xl border border-white/5 ring-1 ring-brand-gold/10">
                                {suggestedSizes.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all transform active:scale-90 ${form.sizes.includes(size) ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:border-brand-gold/50'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}

                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block tracking-widest">Танланган ёки қўлда ёзилган:</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.sizes.map(s => (
                                <span key={s} className="bg-brand-gold text-black px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2">
                                    {s} <X size={14} className="cursor-pointer" onClick={() => toggleSize(s)} />
                                </span>
                            ))}
                        </div>
                        <Input placeholder="Бошқа ўлчам... (Enter)" onKeyDown={(e: any) => {
                            if (e.key === 'Enter' && e.target.value) {
                                e.preventDefault();
                                toggleSize(e.target.value);
                                e.target.value = '';
                            }
                        }} />
                    </div>
                </div>

                {/* Right Side */}
                <div className="space-y-6">
                    <Input placeholder="Маҳсулот номи" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Input type="number" placeholder="Нархи" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="text-brand-gold font-black text-xl" />

                    <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-4 block flex items-center gap-2"><Truck size={14} /> Етказиб бериш</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {DEFAULT_DELIVERIES.map(d => (
                                <button key={d} type="button" onClick={() => !form.delivery_options.includes(d) && setForm({ ...form, delivery_options: [...form.delivery_options, d] })} className="px-3 py-1 rounded-lg text-[10px] border border-white/10 text-gray-500">+{d}</button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.delivery_options.map(d => (
                                <span key={d} className="bg-white text-black px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2">
                                    {d} <X size={14} className="cursor-pointer text-red-500" onClick={() => setForm({ ...form, delivery_options: form.delivery_options.filter(i => i !== d) })} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {form.images.map((img, i) => (
                            <div key={i} className="w-20 h-20 relative rounded-2xl overflow-hidden group border border-white/10">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"><X /></button>
                            </div>
                        ))}
                        <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-brand-gold transition-all">
                            {uploading ? <Loader2 className="animate-spin text-brand-gold" /> : <ImageIcon className="text-gray-600" />}
                            <input type="file" hidden multiple onChange={handleImageUpload} />
                        </label>
                    </div>

                    <button onClick={handleSave} disabled={loading || uploading} className="w-full py-5 bg-brand-gold text-black font-black rounded-2xl uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {editingId ? "Янгилашни Сақлаш" : "Маҳсулотни Сақлаш"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}