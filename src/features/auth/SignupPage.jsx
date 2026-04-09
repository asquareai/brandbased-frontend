import React, { useState, useEffect, useRef } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentText, setCurrentText] = useState(1);

    const inputRefs = useRef([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentText((prev) => (prev === 1 ? 2 : 1));
        }, 4000);
        return () => clearInterval(timer);
    }, []);

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

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/signup/send-otp', { email });
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || "Error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        const combinedOtp = otp.join('');
        if (combinedOtp.length < 6) {
            alert("Please enter the full 6-digit code");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/signup/verify-otp', { email, otp: combinedOtp });
            setStep(4);
        } catch (error) {
            alert(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/auth/signup/complete', {
                email,
                password,
                password_confirmation: passwordConfirm
            });
            if (response.data.access_token) {
                localStorage.setItem('auth_token', response.data.access_token);
                window.location.href = '/dashboard'; 
            }
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    // Shared Button Style
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
        gap: '10px',
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

                <div className="moving-subtitle" style={{ textAlign: 'center', height: '24px', marginBottom: '10px' }}>
                    <span className={`text-slide ${currentText === 1 ? 'active' : ''}`} style={{ color: '#000' }}>Create your account</span>
                    <span className={`text-slide ${currentText === 2 ? 'active' : ''}`} style={{ color: '#000' }}>Join a Brand - New Movement</span>
                </div>

                <div className="form-container" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* STEP 1: CTA */}
                    {step === 1 && (
                        <button onClick={() => setStep(2)} style={primaryButtonStyle}>
                            <img src="/assets/email-icon-login-signup.svg" alt="email" width="20" />
                            Sign up with email
                        </button>
                    )}

                    {/* STEP 2: Email */}
                    {step === 2 && (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                className="glass-input"
                                style={{ textAlign: 'center', width: '100%' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" style={primaryButtonStyle} disabled={loading}>
                                {loading ? "Sending..." : "Send Code"}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="back-link" style={{ marginTop: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Back</button>
                        </form>
                    )}

                    {/* STEP 3: OTP */}
                    {step === 3 && (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center', color: '#000' }}>
                                Enter the code sent to <br/><strong>{email}</strong>
                            </p>
                            <div className="otp-container" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
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
                            <button type="submit" style={primaryButtonStyle} disabled={loading || otp.join('').length < 6}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    )}

                    {/* STEP 4: Password Setup */}
                    {step === 4 && (
                        <form onSubmit={handleCompleteSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <input 
                                type="password" 
                                placeholder="Password" 
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
                                {loading ? "Processing..." : "Complete"}
                            </button>
                        </form>
                    )}

                    <p className="signin" style={{ 
                        textAlign: 'center', 
                        marginTop: '30px', 
                        width: '100%', 
                        fontSize: '0.9rem',
                        color: '#000'
                    }}>
                        Already have an account? 
                        <a href="/login" style={{ fontWeight: '700', color: '#000', textDecoration: 'underline', marginLeft: '5px' }}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;