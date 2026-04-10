"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FIXED_CATEGORIES } from './constants';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const EMPTY_FORM = {
    name: '',
    price: '',
    category: 'clothes',
    description: '',
    images: [] as string[],
    sizes: ['S', 'M', 'L', 'XL'] as string[],
    colors: [] as string[],
    in_stock: true,
    is_new: false,
};

export default function AdminShop() {
    const [products, setProducts] = useState<any[]>([]);
    const [customCategories, setCustomCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const allCategories = [...FIXED_CATEGORIES, ...customCategories];

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setProducts(data);
            // Custom kategoriyalarni bazadan olish
            const cats = [...new Set(data.map((p: any) => p.category))]
                .filter(cat => !FIXED_CATEGORIES.find(f => f.id === cat))
                .map(cat => ({ id: cat as string, label: cat as string, type: 'other' }));
            setCustomCategories(cats);
        }
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
        setForm(EMPTY_FORM);
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

    return (
        <div className="space-y-8">
            <ProductForm
                onSuccess={() => {
                    // Bu yerga mahsulot saqlangandan keyin nima bo'lishi kerakligini yozasiz
                    // Masalan, ro'yxatni yangilash funksiyasi bo'lsa: fetchProducts();
                    console.log("Mahsulot muvaffaqiyatli saqlandi!");
                }}
            />
            <ProductList
                products={products}
                allCategories={allCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}