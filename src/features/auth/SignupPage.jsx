import React, { useState, useEffect, useRef } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../api/axios';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    // Updated: OTP is now an array of 6 strings
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentText, setCurrentText] = useState(1);

    // Ref to manage focus on the 6 individual boxes
    const inputRefs = useRef([]);

    // Subtitle Animation Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentText((prev) => (prev === 1 ? 2 : 1));
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // OTP Input Handling Logic
    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move focus to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move focus to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Phase 1: Request OTP
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

    // Phase 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        const combinedOtp = otp.join(''); // Combine the 6 boxes into one string
        
        if (combinedOtp.length < 6) {
            alert("Please enter the full 6-digit code");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup/verify-otp', { email, otp: combinedOtp });
            setStep(4); // Move to Password Setup
        } catch (error) {
            alert(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Phase 3: Finalize Account
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
                alert("Account created successfully!");
                window.location.href = '/dashboard'; 
            }
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed");
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

                <div className="moving-subtitle">
                    <span className={`text-slide ${currentText === 1 ? 'active' : ''}`}>Create your account</span>
                    <span className={`text-slide ${currentText === 2 ? 'active' : ''}`}>Join a Brand - New Movement</span>
                </div>

                {/* STEP 1: CTA */}
                {step === 1 && (
                    <button onClick={() => setStep(2)} className="signup-btn">
                        <img src="/assets/email-icon-login-signup.svg" alt="email" width="22" />
                        Sign up with email
                    </button>
                )}

                {/* STEP 2: Email Collection */}
                {step === 2 && (
                    <form onSubmit={handleSendOtp} className="auth-form fade-in">
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            className="glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="back-link">Back</button>
                    </form>
                )}

                {/* STEP 3: OTP Verification (Enhanced with 6-digit layout) */}
                {step === 3 && (
                    <form onSubmit={handleVerifyOtp} className="auth-form fade-in">
                        <p className="step-hint">Enter the 6-digit code sent to <strong>{email}</strong></p>
                        
                        <div className="otp-container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="otp-input"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength="1"
                                    inputMode="numeric"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <button type="submit" className="signup-btn" disabled={loading || otp.join('').length < 6}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button type="button" onClick={() => {
                            setStep(2);
                            setOtp(['', '', '', '', '', '']); // Reset OTP on back
                        }} className="back-link">Change Email</button>
                    </form>
                )}

                {/* STEP 4: Password Setup */}
                {step === 4 && (
                    <form onSubmit={handleCompleteSignup} className="auth-form fade-in">
                        <p className="step-hint">Set a secure password for your account</p>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="glass-input"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? "Creating Account..." : "Complete Registration"}
                        </button>
                    </form>
                )}

                <p className="signin" style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
                    Already have an account? <a href="/login" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Sign in</a>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;