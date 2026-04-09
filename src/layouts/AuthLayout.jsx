import React, { useEffect, useRef } from 'react';
import '../features/auth/styles/auth.css';

const AuthLayout = ({ children }) => {
    const videoRef = useRef(null);

    // Industrial Standard: Ensure video plays across all browsers
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay was prevented. User interaction may be required.", error);
            });
        }
    }, []);

    return (
        <div className="auth-wrapper">
            {/* Background Animated Shards - Optimized for Performance */}
            <div className="light-shard-ui-base" aria-hidden="true">
                <div className="light-shard-ui-theme"></div>
                <div className="light-shard-ui-theme" style={{ "--delay": "-12s", "--size": "0.35", "--speed": "45s" }}></div>
                <div className="light-shard-ui-theme" style={{ "--delay": "-10s", "--size": "0.3", "--speed": "30s" }}></div>
            </div>

            <div className="container">
                {/* Left Panel: Form & Identity */}
                <div className="left-panel">
                    <div className="left-panel-content">
                        <img 
                            src="/assets/Brandbased-icon.svg" 
                            alt="Brandbased Logo" 
                            className="logo-top" 
                        />
                        
                        {/* Container for Signup/Login/OTP Steps */}
                        <main className="auth-form-container">
                            {children}
                        </main>

                        <footer className="footer">
                            <p>
                                By continuing, you agree to our 
                                <a href="/terms"> Terms of Service</a> and 
                                <a href="/privacy"> Privacy Policy</a>
                            </p>
                        </footer>
                    </div>
                </div>

                {/* Right Panel: Immersive Video Experience */}
                <div className="right-panel">
                    <video 
                        ref={videoRef}
                        className="video-bg" 
                        muted 
                        loop 
                        playsInline 
                        poster="/assets/video-fallback.jpg" // Optional fallback image
                    >
                        <source src="/assets/brand-based-hero-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="overlay"></div>
                    
                    {/* Visual Branding Layer */}
                    <div className="branding-overlay">
                        <img src="/assets/Brandbased-icon-white.svg" alt="" className="center-logo" />
                        <img src="/assets/BrandBased-Typeface-white.svg" alt="BrandBased" className="bottom-brand" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;