import { supabase } from '@/lib/supabase';
import ShopContent from './ShopContent';

export const revalidate = 0;

export default async function ShopPage() {
    // Faqat products jadvalidan ma'lumot olamiz
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#0a0a0a]">
            <ShopContent products={products || []} />
        </main>
    );
}