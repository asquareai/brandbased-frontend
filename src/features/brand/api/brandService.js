import axios from 'axios';

// Replace with your Laravel API URL
const API_BASE_URL = 'http://localhost:8000/api';

// src/features/brand/api/brandService.js
export const submitBrandForVerification = async (payload) => {
    // 1. Get the token from storage
    const token = localStorage.getItem('auth_token'); // <--- CHECK THIS NAME

    const formData = new FormData();
    formData.append('brand_name', payload.brand_name);
    formData.append('website_url', payload.website_url);
    formData.append('logo', payload.logo);

    // 2. Send the request
    return await axios.post('http://127.0.0.1:8000/api/brands/store', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // <--- THIS MUST BE PRESENT
        }
    });
};