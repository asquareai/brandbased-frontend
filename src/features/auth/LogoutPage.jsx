import React, { useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const LogoutPage = () => {
    useEffect(() => {
        // 1. NUKE LOCAL STORAGE IMMEDIATELY (Synchronous)
        // This stops Global Route Guards from bouncing you back to /landing
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        localStorage.clear(); 

        const performLogout = async () => {
            try {
                // 2. BACKEND REVOKE (Wait for it if you want, but storage is already gone)
                await api.post('/auth/logout');
            } catch (error) {
                console.error("Session already dead on backend", error);
            } finally {
                // 3. HARD REDIRECT
                // Use a real route like '/login'. If this still goes to landing, 
                // check your App.js for a "/" to "/landing" redirect.
                window.location.replace('/login');
            }
        };

        performLogout();
    }, []);

    return (
        <AuthLayout>
            <div className="auth-content-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="brand-name" style={{ textAlign: 'center', width: '100%' }}>
                    <span className="brand-name-inner">
                        <img src="/assets/BrandBased-Typeface.svg" style={{ width: '280px', maxWidth: '80%' }} alt="BrandBased" />
                    </span>
                </h1>
                <div className="fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>
                    <div className="loader"></div>
                    <h2 className="step-title">Signing you out...</h2>
                </div>
            </div>
            <style>{`
                .loader {
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #000;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </AuthLayout>
    );
};

export default LogoutPage;