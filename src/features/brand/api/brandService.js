// src/features/brand/api/brandService.js
import axiosInstance from '../../../api/axios.js'; // Adjust the number of ../ based on your actual folder depth

export const submitBrandForVerification = async (payload) => {
    const token = localStorage.getItem('auth_token');

    const formData = new FormData();
    formData.append('brand_name', payload.brand_name);
    formData.append('website_url', payload.website_url);
    formData.append('logo', payload.logo);

    // Now axiosInstance will be recognized
    return await axiosInstance.post('/brands/store', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });
};