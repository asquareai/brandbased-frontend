import React, { useState, useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- 1. DEFENSIVE REDIRECT ---
   useEffect(() => {
        const token = localStorage.getItem('auth_token');
        
        // Check for "null" as a string, which sometimes happens in JS
        if (token && token !== 'null' && token !== 'undefined') {
            window.location.replace('/landing');
        }
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.access_token) {
                // Set the token
                localStorage.setItem('auth_token', response.data.access_token);
                
                if (response.data.user) {
                    localStorage.setItem('user_info', JSON.stringify(response.data.user));
                }
                
                // Use replace for a cleaner history stack
                window.location.replace('/landing');
            }
        } catch (err) {
            const message = err.response?.data?.message || "Invalid credentials. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-content-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="brand-name" style={{ textAlign: 'center', width: '100%' }}>
                    <span className="brand-name-inner">
                        <img src="/assets/BrandBased-Typeface.svg" style={{ width: '280px', maxWidth: '80%' }} alt="BrandBased" />
                    </span>
                </h1>

                <form 
                    onSubmit={handleLogin} 
                    className="auth-form fade-in" 
                    style={{
                        marginTop: '40px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '100%',
                        maxWidth: '350px'
                    }}
                >
                    <h2 className="step-title" style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome back</h2>
                    
                    {error && (
                        <div className="auth-error-message" style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            width: '100%',
                            marginBottom: '15px',
                            color: '#d93025' // Standard error red
                        }}>
                            <img src="/assets/error-icon.svg" alt="error" width="16" style={{ marginRight: '8px' }} />
                            <span style={{ fontSize: '0.9rem' }}>{error}</span>
                        </div>
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className={`glass-input ${error ? 'input-error' : ''}`}
                        style={{ textAlign: 'center', width: '100%', marginBottom: '15px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className={`glass-input ${error ? 'input-error' : ''}`}
                        style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button 
                            type="submit" 
                            className="signup-btn" 
                            disabled={loading}
                            style={{ 
                                width: '180px', 
                                padding: '12px 0',
                                borderRadius: '25px',
                                border: 'none',
                                background: '#000',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="/forgot-password" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </div>

                    <p className="signin" style={{ 
                        textAlign: 'center', 
                        marginTop: '30px', 
                        width: '100%', 
                        fontSize: '0.9rem',
                        color: '#000000',
                        opacity: 0.8
                    }}>
                        Don't have an account? 
                        <a href="/signup" style={{ 
                            fontWeight: '700', 
                            color: '#000000', 
                            textDecoration: 'underline',
                            marginLeft: '5px'
                        }}>
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;