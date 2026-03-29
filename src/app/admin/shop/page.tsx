"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Loader2, Save, Edit3, Check, Search, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CLOTHES_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const FIXED_CATEGORIES = [
    { id: 'clothes', label: 'Kiyimlar', type: 'clothes' },
    { id: 'shoes', label: 'Oyoq kiyimlar', type: 'shoes' },
];

export default function AdminShop() {
    const [products, setProducts] = useState<any[]>([]);
    const [customCategories, setCustomCategories] = useState<{ id: string; label: string; type: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCatInput, setNewCatInput] = useState('');
    const [showNewCat, setShowNewCat] = useState(false);
    const [tempSize, setTempSize] = useState('');
    const [tempColor, setTempColor] = useState('');

    const allCategories = [...FIXED_CATEGORIES, ...customCategories];

    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'clothes',
        description: '',
        images: [] as string[],
        sizes: ['S', 'M', 'L', 'XL'] as string[],
        colors: [] as string[],
        in_stock: true,
        is_new: false,
    });

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) {
            setProducts(data);
            const existingCats = [...new Set(data.map((p: any) => p.category))]
                .filter(cat => !FIXED_CATEGORIES.find(f => f.id === cat))
                .map(cat => ({ id: cat as string, label: cat as string, type: 'other' }));
            setCustomCategories(existingCats);
        }
    };

    const getCatType = (catId: string) =>
        allCategories.find(c => c.id === catId)?.type || 'other';

    const handleCategoryChange = (catId: string) => {
        const type = getCatType(catId);
        let autoSizes: string[] = [];
        if (type === 'clothes') autoSizes = ['S', 'M', 'L', 'XL'];
        if (type === 'shoes') autoSizes = ['38', '39', '40', '41', '42'];
        setForm(prev => ({ ...prev, category: catId, sizes: autoSizes }));
    };

    const toggleSize = (s: string) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(s)
                ? prev.sizes.filter(x => x !== s)
                : [...prev.sizes, s]
        }));
    };

    const addCustomSize = () => {
        if (!tempSize.trim()) return;
        if (!form.sizes.includes(tempSize.trim())) {
            setForm(prev => ({ ...prev, sizes: [...prev.sizes, tempSize.trim()] }));
        }
        setTempSize('');
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (form.images.length + files.length > 5) {
            alert("Maksimum 5 ta rasm!");
            return;
        }
        setUploading(true);
        for (const file of files) {
            const path = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            const { data: upData, error } = await supabase.storage
                .from('products')
                .upload(path, file, { upsert: true });
            if (upData && !error) {
                const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
                setForm(prev => ({ ...prev, images: [...prev.images, urlData.publicUrl] }));
            }
        }
        setUploading(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) {
            alert("Nomi va narxini kiriting!");
            return;
        }
        setLoading(true);
        const payload = {
            name: form.name,
            price: Number(form.price),
            category: form.category,
            description: form.description,
            images: form.images,
            sizes: form.sizes,
            colors: form.colors,
            in_stock: form.in_stock,
            is_new: form.is_new,
        };

        if (editingId) {
            await supabase.from('products').update(payload).eq('id', editingId);
        } else {
            await supabase.from('products').insert([payload]);
        }

        resetForm();
        fetchProducts();
        setLoading(false);
    };

    const resetForm = () => {
        setForm({
            name: '', price: '', category: 'clothes',
            description: '', images: [],
            sizes: ['S', 'M', 'L', 'XL'], colors: [],
            in_stock: true, is_new: false,
        });
        setEditingId(null);
    };

    const handleEdit = (p: any) => {
        setForm({
            name: p.name || '',
            price: String(p.price || ''),
            category: p.category || 'clothes',
            description: p.description || '',
            images: p.images || [],
            sizes: p.sizes || [],
            colors: p.colors || [],
            in_stock: p.in_stock ?? true,
            is_new: p.is_new ?? false,
        });
        setEditingId(p.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("O'chirilsinmi?")) return;
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    };

    const addCategory = () => {
        if (!newCatInput.trim()) return;
        const id = newCatInput.toLowerCase().replace(/\s+/g, '_');
        if (!allCategories.find(c => c.id === id)) {
            setCustomCategories(prev => [...prev, { id, label: newCatInput.trim(), type: 'other' }]);
            setForm(prev => ({ ...prev, category: id, sizes: [] }));
        }
        setNewCatInput('');
        setShowNewCat(false);
    };

    const deleteCustomCategory = (catId: string, catLabel: string) => {
        const count = products.filter(p => p.category === catId).length;
        if (count > 0) {
            alert(`"${catLabel}" da ${count} ta mahsulot bor! Avval ularni o'chiring.`);
            return;
        }
        setCustomCategories(prev => prev.filter(c => c.id !== catId));
        if (form.category === catId) handleCategoryChange('clothes');
        if (filterCat === catId) setFilterCat('all');
    };

    const catType = getCatType(form.category);

    const filtered = products.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'all' || p.category === filterCat;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-8">

            {/* ═══ FORMA ═══ */}
            <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black dark:text-white uppercase italic">
                        {editingId ? "Tahrirlash" : "Yangi mahsulot"}
                    </h2>
                    {editingId && (
                        <button
                            onClick={resetForm}
                            className="text-xs font-bold text-red-500 border border-red-500/30 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
                        >
                            Bekor qilish
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* ═ CHAP USTUN ═ */}
                    <div className="space-y-5">

                        {/* RASMLAR */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3">
                                Rasmlar (max 5 ta)
                            </p>
                            <div className="grid grid-cols-5 gap-2">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                        <button
                                            onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                                            className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                        >
                                            <X size={16} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {form.images.length < 5 && (
                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
                                        {uploading ? (
                                            <Loader2 size={20} className="animate-spin text-brand-gold" />
                                        ) : (
                                            <>
                                                <Plus size={20} className="text-gray-400" />
                                                <span className="text-[9px] text-gray-400 mt-1">Rasm</span>
                                            </>
                                        )}
                                        <input type="file" hidden multiple accept="image/*" onChange={handleUpload} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* RAZMERLAR */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3">
                                Razmerlar
                            </p>

                            {/* Kiyimlar tugmalari */}
                            {catType === 'clothes' && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {CLOTHES_SIZES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSize(s)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${form.sizes.includes(s)
                                                    ? 'bg-brand-gold text-black'
                                                    : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Oyoq kiyim tugmalari */}
                            {catType === 'shoes' && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {SHOE_SIZES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSize(s)}
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${form.sizes.includes(s)
                                                    ? 'bg-brand-gold text-black'
                                                    : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Tanlangan razmerlar — X bilan */}
                            {form.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {form.sizes.map(s => (
                                        <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/20 text-brand-gold rounded-xl text-xs font-black">
                                            {s}
                                            <X
                                                size={12}
                                                className="cursor-pointer hover:text-red-500"
                                                onClick={() => setForm(prev => ({ ...prev, sizes: prev.sizes.filter(x => x !== s) }))}
                                            />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Qo'lda razmer */}
                            <div className="flex gap-2">
                                <input
                                    value={tempSize}
                                    onChange={e => setTempSize(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addCustomSize()}
                                    placeholder={
                                        catType === 'clothes' ? "Boshqa razmer (masalan: 4XL)..."
                                            : catType === 'shoes' ? "Boshqa son (masalan: 46)..."
                                                : "Razmer kiriting..."
                                    }
                                    className="flex-1 bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl px-4 py-2 text-sm outline-none"
                                />
                                <button onClick={addCustomSize} className="p-2 bg-brand-gold rounded-xl">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* RANGLAR */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3">
                                Ranglar
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {form.colors.map(c => (
                                    <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 dark:text-white rounded-xl text-xs font-bold">
                                        {c}
                                        <X
                                            size={12}
                                            className="text-red-400 cursor-pointer"
                                            onClick={() => setForm({ ...form, colors: form.colors.filter(x => x !== c) })}
                                        />
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={tempColor}
                                    onChange={e => setTempColor(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && tempColor.trim()) {
                                            setForm(prev => ({ ...prev, colors: [...prev.colors, tempColor.trim()] }));
                                            setTempColor('');
                                        }
                                    }}
                                    placeholder="Qora, Oq, Ko'k..."
                                    className="flex-1 bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl px-4 py-2 text-sm outline-none"
                                />
                                <button
                                    onClick={() => {
                                        if (tempColor.trim()) {
                                            setForm(prev => ({ ...prev, colors: [...prev.colors, tempColor.trim()] }));
                                            setTempColor('');
                                        }
                                    }}
                                    className="p-2 bg-brand-gold rounded-xl"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ═ O'NG USTUN ═ */}
                    <div className="space-y-4">

                        {/* NOMI */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Nomi</p>
                            <input
                                placeholder="Mahsulot nomi"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-gray-100 dark:bg-white/5 dark:text-white rounded-2xl px-5 py-3.5 outline-none font-bold text-sm"
                            />
                        </div>

                        {/* NARXI */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Narxi (som)</p>
                            <input
                                type="number"
                                placeholder="1500"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full bg-gray-100 dark:bg-white/5 dark:text-white rounded-2xl px-5 py-3.5 outline-none font-bold text-sm"
                            />
                        </div>

                        {/* KATEGORIYA */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Kategoriya</p>
                            <div className="flex flex-wrap gap-2">

                                {/* FIXED — o'chirib bo'lmaydi */}
                                {FIXED_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${form.category === cat.id
                                                ? 'bg-brand-gold text-black'
                                                : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}

                                {/* CUSTOM — qizil X tugmasi bor */}
                                {customCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${form.category === cat.id
                                                    ? 'bg-brand-gold text-black'
                                                    : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                        <button
                                            onClick={() => deleteCustomCategory(cat.id, cat.label)}
                                            className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0"
                                            title="Kategoriyani o'chirish"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                ))}

                                {/* YANGI KATEGORIYA */}
                                {showNewCat ? (
                                    <div className="flex gap-2">
                                        <input
                                            value={newCatInput}
                                            onChange={e => setNewCatInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addCategory()}
                                            placeholder="Kategoriya nomi..."
                                            autoFocus
                                            className="bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl px-3 py-2 text-sm outline-none font-bold w-36"
                                        />
                                        <button onClick={addCategory} className="p-2 bg-brand-gold rounded-xl">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setShowNewCat(false)} className="p-2 bg-gray-200 dark:bg-white/10 rounded-xl">
                                            <X size={16} className="dark:text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowNewCat(true)}
                                        className="px-4 py-2 rounded-xl text-sm font-black bg-gray-100 dark:bg-white/10 dark:text-white border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-brand-gold transition-all flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Yangi
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* TAVSIF */}
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Tavsif</p>
                            <textarea
                                placeholder="Mahsulot haqida..."
                                rows={3}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-gray-100 dark:bg-white/5 dark:text-white rounded-2xl px-5 py-3.5 outline-none resize-none text-sm"
                            />
                        </div>

                        {/* TOGGLELAR */}
                        <div className="flex gap-6">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setForm(p => ({ ...p, in_stock: !p.in_stock }))}
                            >
                                <div className={`w-11 h-6 rounded-full transition-colors ${form.in_stock ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform ${form.in_stock ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="text-sm font-bold dark:text-white">Mavjud</span>
                            </div>

                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setForm(p => ({ ...p, is_new: !p.is_new }))}
                            >
                                <div className={`w-11 h-6 rounded-full transition-colors ${form.is_new ? 'bg-brand-gold' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform ${form.is_new ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="text-sm font-bold dark:text-white">Yangi</span>
                            </div>
                        </div>

                        {/* SAQLASH */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 bg-brand-gold text-black font-black rounded-2xl uppercase tracking-widest flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : editingId ? (
                                <><Check size={20} /> Yangilash</>
                            ) : (
                                <><Save size={20} /> Saqlash</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ SEARCH + FILTER ═══ */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Mahsulot qidirish..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 dark:text-white rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 ring-brand-gold"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setFilterCat('all')}
                        className={`px-4 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${filterCat === 'all'
                                ? 'bg-brand-gold text-black'
                                : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10'
                            }`}
                    >
                        Barchasi ({products.length})
                    </button>
                    {allCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCat(cat.id)}
                            className={`px-4 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${filterCat === cat.id
                                    ? 'bg-brand-gold text-black'
                                    : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10'
                                }`}
                        >
                            {cat.label} ({products.filter(p => p.category === cat.id).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ RO'YXAT ═══ */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">Mahsulot topilmadi</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(p => (
                        <div key={p.id} className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden hover:border-brand-gold/30 transition-all">
                            <div className="relative aspect-video bg-gray-100 dark:bg-white/5">
                                {p.images?.[0] ? (
                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-gray-300" />
                                    </div>
                                )}
                                {p.is_new && (
                                    <span className="absolute top-2 left-2 bg-brand-gold text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                        Yangi
                                    </span>
                                )}
                                {!p.in_stock && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                        Tugagan
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-black text-sm dark:text-white uppercase italic mb-1 line-clamp-1">
                                    {p.name}
                                </h3>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-brand-gold font-black">
                                        {Number(p.price).toLocaleString()} som
                                    </p>
                                    <span className="text-[10px] bg-gray-100 dark:bg-white/10 dark:text-white px-2 py-0.5 rounded-full font-bold">
                                        {allCategories.find(c => c.id === p.category)?.label || p.category}
                                    </span>
                                </div>
                                {p.sizes?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {p.sizes.slice(0, 6).map((s: string) => (
                                            <span key={s} className="text-[10px] bg-gray-100 dark:bg-white/10 dark:text-white px-2 py-0.5 rounded font-bold">
                                                {s}
                                            </span>
                                        ))}
                                        {p.sizes.length > 6 && (
                                            <span className="text-[10px] text-gray-400 font-bold">+{p.sizes.length - 6}</span>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500/10 text-blue-500 rounded-2xl text-xs font-black hover:bg-blue-500 hover:text-white transition-all"
                                    >
                                        <Edit3 size={14} /> O'zgartirish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 text-red-500 rounded-2xl text-xs font-black hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={14} /> O'chirish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}