import React, { useState, useRef } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Refs to manage focus between boxes
    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return; // Only allow numbers
        
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Keep only last digit
        setOtp(newOtp);

        // Move to next box if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous box on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join(''); // Combine array to single string
        
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
        } finally {
            setLoading(false);
        }
    };

    // ... handleRequestOtp remains the same as before ...
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (error) {
            alert(error.response?.data?.message || "Error");
        } finally { setLoading(false); }
    };

    return (
        <AuthLayout>
            <div className="auth-content-center">
                <h1 className="brand-name">
                    <span className="brand-name-inner">
                        <img src="/assets/BrandBased-Typeface.svg" width="100%" alt="BrandBased" />
                    </span>
                </h1>

                <div className="auth-form fade-in" style={{ marginTop: '40px' }}>
                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp}>
                            <h2 className="step-title">Reset Password</h2>
                            <p className="step-hint">Enter your email to receive a code.</p>
                            <input type="email" placeholder="Email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <button type="submit" className="signup-btn" disabled={loading}>Send Reset Code</button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <h2 className="step-title">Verify Code</h2>
                            <p className="step-hint">Sent to <strong>{email}</strong></p>
                            
                            {/* OTP TABLE UI */}
                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="otp-input" // This links to your auth.css
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        maxLength="1"
                                        inputMode="numeric"
                                    />
                                ))}
                            </div>
                            
                            <input type="password" placeholder="New Password" className="glass-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <input type="password" placeholder="Confirm Password" className="glass-input" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
                            
                            <button type="submit" className="signup-btn" disabled={loading}>Update Password</button>
                        </form>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;