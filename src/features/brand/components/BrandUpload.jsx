import React, { useState } from 'react';
import { submitBrandForVerification } from '../api/brandService';

const BrandUpload = () => {
    const [status, setStatus] = useState('idle'); 
    const [payload, setPayload] = useState({
        brand_name: '',
        website_url: '',
        logo: null
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setPayload(prev => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        setPayload(prev => ({ ...prev, logo: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await submitBrandForVerification(payload);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            console.error("Verification failed:", err);
        }
    };

    return (
        <div className="brand-upload-card bg-white p-6 rounded shadow-lg border border-gray-100 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Brand Verification</h2>
            
            {status === 'success' ? (
                <div className="text-center py-4">
                    <div className="text-green-600 font-medium mb-4">
                        ✅ Logo uploaded! Verification in progress...
                    </div>
                    <button 
                        onClick={() => setStatus('idle')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Upload another brand
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 mb-1">BRAND NAME</label>
                        <input 
                            name="brand_name"
                            type="text" 
                            placeholder="Enter Brand Name"
                            className="w-full p-2 border rounded bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInput}
                            required 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 mb-1">WEBSITE URL</label>
                        <input 
                            name="website_url"
                            type="url" 
                            placeholder="https://example.com"
                            className="w-full p-2 border rounded bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInput}
                            required 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 mb-1">BRAND LOGO</label>
                        <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded bg-gray-50">
                            <input 
                                type="file" 
                                onChange={handleFile} 
                                accept="image/*,.svg"
                                className="text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                required 
                            />
                        </div>
                    </div>
                    
                    {/* The Submit Button - Force display block to ensure visibility */}
                    <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-2 px-4 rounded font-bold text-white transition-all shadow-md mt-2 block
                            ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'}`}
                    >
                        {status === 'loading' ? 'Uploading...' : 'Verify Brand'}
                    </button>

                    {status === 'error' && (
                        <p className="text-red-500 text-xs mt-2 text-center">Failed to upload. Please check your connection.</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default BrandUpload;