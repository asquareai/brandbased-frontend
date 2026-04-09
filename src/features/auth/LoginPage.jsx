import React, { useState, useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // New state for error messages
    const [error, setError] = useState('');

    // Automatically clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);
        
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.access_token) {
                localStorage.setItem('auth_token', response.data.access_token);
                window.location.href = '/dashboard';
            }
        } catch (err) {
            // Extract message from Laravel response
            const message = err.response?.data?.message || "Invalid credentials. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-content-center">
                <h1 className="brand-name">
                    <span className="brand-name-inner">
                        <img src="/assets/BrandBased-Typeface.svg" width="100%" alt="BrandBased" />
                    </span>
                </h1>

                <form onSubmit={handleLogin} className="auth-form fade-in" style={{marginTop: '40px'}}>
                    <h2 className="step-title">Welcome back</h2>
                    
                    {/* ENHANCED ERROR MESSAGE AREA */}
                    {error && (
                        <div className="auth-error-message">
                            <img src="/assets/error-icon.svg" alt="error" width="16" />
                            {error}
                        </div>
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className={`glass-input ${error ? 'input-error' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className={`glass-input ${error ? 'input-error' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <a href="/forgot-password" style={{ fontSize: '0.85rem', color: '#000', textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </div>

                    <p className="signin" style={{ textAlign: 'center', marginTop: '30px', width: '100%' }}>
                        Don't have an account? <a href="/signup" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>Sign up</a>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;