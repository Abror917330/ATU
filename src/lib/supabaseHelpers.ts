import { supabase } from './supabase';

// PRODUCTS
export async function getProducts(category?: string) {
    let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// CREATIVE
export async function getCreativeItems(type?: string) {
    let query = supabase
        .from('creative_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (type && type !== 'all') {
        query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getCreativeById(id: string) {
    const { data, error } = await supabase
        .from('creative_items')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// YOUTH POSTS
export async function getYouthPosts(type?: string) {
    let query = supabase
        .from('youth_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (type && type !== 'all') {
        query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getYouthPostById(id: string) {
    const { data, error } = await supabase
        .from('youth_posts')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// BANNERS
export async function getBanners() {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
}

// ORDERS
export async function createOrder(order: {
    user_id?: string;
    items: any[];
    total: number;
    name: string;
    phone: string;
    address?: string;
}) {
    const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getUserOrders(userId: string) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// PROFILE
export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateProfile(userId: string, updates: {
    full_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
}) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// FAVORITES (logged in users)
export async function addFavorite(userId: string, itemId: string, itemType: string) {
    const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, item_id: itemId, item_type: itemType });
    if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(userId: string, itemId: string, itemType: string) {
    const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, item_id: itemId, item_type: itemType });
    if (error) throw error;
}

export async function getUserFavorites(userId: string) {
    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

// STORAGE
export function getStorageUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
    if (error) throw error;
    return getStorageUrl(bucket, data.path);
}

export async function deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
}