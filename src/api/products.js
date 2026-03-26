import api from './axios';
import { categories as localCategories } from '../data/categories';


export const getProducts = async (params = {}) => {
    try {
        const response = await api.get('products/', { params });
        console.log('GET products response:', response.data);

        // Handle various API response structures
        if (Array.isArray(response.data)) return response.data;
        if (response.data?.results && Array.isArray(response.data.results)) return response.data.results;
        if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;

        return [];
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
};

export const getProductById = async (id) => {
    const response = await api.get(`products/${id}/`);
    return response.data;
};

export const getProductsByCategory = async (slug, params = {}) => {
    try {
        const response = await api.get(`products/category/${slug}/`, { params });
        const data = response.data;

        // Handle various API response structures
        if (Array.isArray(data)) return data;
        if (data?.results && Array.isArray(data.results)) return data.results;
        if (data?.data && Array.isArray(data.data)) return data.data;

        return [];
    } catch (error) {
        console.error(`getProductsByCategory error for ${slug}:`, error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('products/categories/');
        const data = response.data;
        
        let fetchedCategories = [];
        if (Array.isArray(data)) fetchedCategories = data;
        else if (data?.results && Array.isArray(data.results)) fetchedCategories = data.results;
        else if (data?.data && Array.isArray(data.data)) fetchedCategories = data.data;

        // Map backend categories with local UI properties (icons, colors)
        return fetchedCategories.map(cat => {
            const local = localCategories.find(c => c.slug === cat.slug) || {};
            return {
                ...local,
                ...cat, // backend overrides local id, name, slug
                icon: local.icon || "📦",
                bgColor: local.bgColor || "#f3f4f6", // default light gray
                color: local.color || "#6b7280",      // default gray text
                count: cat.count || local.count || 0
            };
        });
    } catch (error) {
        console.error('getCategories error:', error);
        return localCategories; // fallback to local on failure
    }
}

export const getFeaturedProducts = async () => {
    const response = await api.get('products/', { params: { featured: true } });
    return response.data;
};