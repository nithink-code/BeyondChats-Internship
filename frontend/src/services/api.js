import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Article API endpoints
export const articleAPI = {
    // Get all articles
    getAll: async () => {
        const response = await api.get('/articles');
        return response.data;
    },

    // Get single article by ID
    getById: async (id) => {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    },

    // Create new article
    create: async (articleData) => {
        const response = await api.post('/articles', articleData);
        return response.data;
    },

    // Update article
    update: async (id, articleData) => {
        const response = await api.put(`/articles/${id}`, articleData);
        return response.data;
    },

    // Delete article
    delete: async (id) => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },

    // Scrape articles
    scrape: async () => {
        const response = await api.get('/articles/scrape');
        return response.data;
    },
};

export default api;
