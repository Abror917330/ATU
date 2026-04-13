"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { LayoutDashboard, List } from 'lucide-react';

export default function AdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setProducts(data);
        setLoading(false);
    }

    useEffect(() => { fetchProducts(); }, []);

    const handleEdit = (id: string) => {
        setEditingId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("O'chirishni xohlaysizmi?")) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) fetchProducts();
    };

    const handleSuccess = () => {
        setEditingId(null);
        fetchProducts();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                    <div className="p-4 bg-brand-gold rounded-3xl"><LayoutDashboard className="text-black" size={32} /></div>
                    <div>
                        <h1 className="text-4xl font-black uppercase">Admin Panel</h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase">Boshqaruv tizimi</p>
                    </div>
                </div>

                <ProductForm editingId={editingId} onSuccess={handleSuccess} />

                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-brand-gold">
                        <List size={20} />
                        <h3 className="text-xl font-black uppercase">Mahsulotlar</h3>
                    </div>
                    <ProductList
                        products={products}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </section>
            </div>
        </div>
    );
}