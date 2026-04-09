import React, { useState, useRef } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    
    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (error) {
            alert(error.response?.data?.message || "Error sending code");
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        if (password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                otp: finalOtp,
                password,
                password_confirmation: passwordConfirm
            });
            alert("Password reset successfully!");
            window.location.href = '/login';
        } catch (error) {
            alert(error.response?.data?.message || "Reset failed");
        } finally { setLoading(false); }
    };

    // Shared Perfect Button Style
    const primaryButtonStyle = {
        width: '220px',
        padding: '12px 0',
        borderRadius: '25px',
        border: 'none',
        background: '#000',
        color: '#fff',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
    };

    return (
        <AuthLayout>
            <div className="auth-content-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="brand-name" style={{ textAlign: 'center', width: '100%' }}>
                    <span className="brand-name-inner">
                        <img src="/assets/BrandBased-Typeface.svg" style={{ width: '280px', maxWidth: '80%' }} alt="BrandBased" />
                    </span>
                </h1>

                <div className="auth-form fade-in" style={{ 
                    marginTop: '40px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: '100%',
                    maxWidth: '400px' 
                }}>
                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <h2 className="step-title">Reset Password</h2>
                                <p className="step-hint" style={{ color: '#000', marginTop: '10px' }}>Enter your email to receive a code.</p>
                            </div>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="glass-input" 
                                style={{ textAlign: 'center', width: '100%' }}
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <button type="submit" style={primaryButtonStyle} disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <h2 className="step-title" style={{ textAlign: 'center' }}>Verify Code</h2>
                            <p className="step-hint" style={{ textAlign: 'center', color: '#000', marginBottom: '20px' }}>
                                Sent to <strong>{email}</strong>
                            </p>
                            
                            <div className="otp-container" style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="otp-input"
                                        style={{ width: '40px', height: '50px', textAlign: 'center', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        maxLength="1"
                                        inputMode="numeric"
                                    />
                                ))}
                            </div>
                            
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                className="glass-input" 
                                style={{ textAlign: 'center', width: '100%', marginBottom: '15px' }}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                className="glass-input" 
                                style={{ textAlign: 'center', width: '100%' }}
                                value={passwordConfirm} 
                                onChange={(e) => setPasswordConfirm(e.target.value)} 
                                required 
                            />
                            
                            <button type="submit" style={primaryButtonStyle} disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <a href="/login" style={{ fontWeight: '700', color: '#000', textDecoration: 'underline', fontSize: '0.9rem' }}>
                            Back to Sign in
                        </a>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;