import api from './axios';

export const sendChatMessage = async (message) => {
    try {
        const response = await api.post('ai/chat/', { message });
        return response.data; // Expected: { message: "...", products: [...] }
    } catch (error) {
        console.error('Chat API Error:', error);
        throw error;
    }
};
