import api from './axios';

export const getProducts = async () => {
    const response = await api.get('products/');
    console.log( response);
    
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`products/${id}/`);
    return response.data;
};

export const getProductsByCategory = async (slug) => {
    const response = await api.get(`products/category/${slug}/`);
    return response.data;
};

export const getFeaturedProducts = async () => {
    const response = await api.get('products/', { params: { featured: true } });
    return response.data;
};
