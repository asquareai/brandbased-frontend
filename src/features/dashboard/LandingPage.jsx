import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import './styles/animate.css';

const LandingPage = () => {
    // --- State Management ---
    const [showSplash, setShowSplash] = useState(true);
    const [view, setView] = useState('home'); // 'home', 'login', 'signup'
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);

    // --- Lifecycle: Auth Gatekeeper ---
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        
        // If no token exists, the user is logged out.
        // Redirect them to the main Login/Auth page immediately.
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    // --- Lifecycle: Splash Delay ---
    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // --- Handlers ---
    const handleLaunchConsole = () => {
        // Since the Auth Gatekeeper passed, we just check for the secondary PIN security
        const savedPin = localStorage.getItem('user_pin');

        if (savedPin) {
            // Show the 4-Digit PIN "Authenticate" popup
            setView('login');
        } else {
            // If no PIN is set, transfer to dashboard directly
            window.location.href = '/dashboard';
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        const enteredPin = e.target.password.value;
        const savedPin = localStorage.getItem('user_pin');

        if (enteredPin === savedPin) {
            window.location.href = '/dashboard';
        } else {
            alert("Incorrect security PIN. Please try again.");
        }
    };

    const handleCloseForm = () => {
        setView('home');
        setIsResetMode(false);
    };

    return (
        <div className="landing-wrapper">
            
            {/* Screen 0: Splash Screen */}
            {showSplash && (
                <div className="screen-splash" id="screen0">
                    <div className="logo animate__animated animate__zoomIn">
                        <img src="/images/splash-logo-white1.svg" width="100%" height="100%" alt="Splash Logo" />
                    </div>
                </div>
            )}

            {/* App Interface */}
            <div className={`app-interface ${!showSplash ? 'visible' : ''}`} 
                 style={{ display: showSplash ? 'none' : 'block' }}>

                <div className="screen visible" id="screen1">
                    <div className="blue-theme animate__animated animate__fadeInUp"></div>
                    
                    <div className="video-background">
                        <video src="/videos/space.mp4" autoPlay muted loop playsInline />
                    </div>

                    <div className="header animate__animated animate__slideInDown">
                        <img src="/images/splash-logo-white1.svg" width="100%" height="100%" alt="Brand Logo" />
                    </div>

                    {/* Slogan Text */}
                    <div className="text animate__animated animate__fadeInUp" id="slogan" 
                         style={{ display: view === 'home' ? 'block' : 'none' }}>
                        <span className="shine-text">
                            Come join a <span style={{ fontStyle: 'italic', fontWeight: 900 }}>brand</span> new movement.
                        </span>
                    </div>

                    {/* --- Authenticate (PIN) Popup Section --- */}
                    <div id="login-form" style={{ display: view === 'login' ? 'block' : 'none' }}>
                        <div id="screen-1-inputs-login" 
                             className="animate__animated animate__slideInUp animate__faster"
                             style={{ width: '90%', maxWidth: '480px' }}>
                            
                            <div className="join-text animate__animated animate__flipInX" style={{ marginTop: '25px' }}>
                                <h2>Authenticate</h2>
                            </div>

                            <div className="logo-form animate__animated animate__bounceIn animate__delay-1s">
                                <img src="/images/b-white.svg" width="100%" height="100%" alt="Logo B" />
                            </div>

                            <div className="close-join-form" onClick={handleCloseForm}>✕</div>
                            
                            <div id="hide-popup-link">
                                <p style={{ 
                                    fontWeight: 600, 
                                    marginTop: '35px', 
                                    marginBottom: '20px', 
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#ffffff' 
                                }}>
                                    Enter Security PIN
                                </p>
                            </div>

                            <div id="login" style={{ display: !isResetMode ? 'block' : 'none' }}>
                                <form onSubmit={handlePinSubmit}>
                                    <div className="form-group">
                                        <div className="password-wrapper">
                                            <input 
                                                type={isPasswordVisible ? "text" : "password"} 
                                                name="password" 
                                                placeholder="4-Digit PIN" 
                                                required 
                                                inputMode="numeric" 
                                                maxLength="4"
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                            />
                                            <span className="toggle-password" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                                <img 
                                                    src="/images/eye-password-icon-open.svg" 
                                                    style={{ display: isPasswordVisible ? 'none' : 'inline', width: '20px' }}
                                                    alt="hide"
                                                />
                                                <img 
                                                    src="/images/eye-password-icon.svg" 
                                                    style={{ display: isPasswordVisible ? 'inline' : 'none', width: '20px' }}
                                                    alt="show"
                                                />
                                            </span>
                                        </div>
                                        <button type="submit" id="submit-button">Unlock Console</button>
                                    </div>
                                </form>
                            </div>

                            {/* Reset Logic */}
                            <div id="send-new-passcode" style={{ display: isResetMode ? 'block' : 'none' }}>
                                <div className="form-group">
                                    <input type="email" placeholder="Associated email" required />
                                    <button type="button" id="submit-button" onClick={() => setIsResetMode(false)}>
                                        Send Reset Code
                                    </button>
                                </div>
                            </div>

                            <p style={{ fontWeight: 500, marginTop: '10px', textAlign: 'center' }}>
                                {isResetMode ? "Nevermind, " : "Forgot PIN?"}
                                <span onClick={() => setIsResetMode(!isResetMode)} style={{ cursor: 'pointer', color: '#5e81f4' }}> 
                                    {isResetMode ? " Return" : " Reset Here"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* --- Signup / Premium Section --- */}
                    <div id="join-form" style={{ display: view === 'signup' ? 'block' : 'none' }}>
                        <div id="screen-1-inputs-signup" 
                             className="animate__animated animate__slideInUp animate__faster"
                             style={{ width: '90%', maxWidth: '480px' }}>
                            <div className="join-text animate__animated animate__flipInX" style={{ marginTop: '25px' }}>
                                <h2>Premium</h2>
                            </div>
                            <div className="logo-form animate__animated animate__bounceIn animate__delay-1s">
                                <img src="/images/b-white.svg" width="100%" height="100%" alt="Logo B" />
                            </div>
                            <div className="close-join-form" onClick={handleCloseForm}>✕</div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <p style={{ color: '#fff', fontSize: '13px', marginBottom: '15px' }}>Upgrade for Pro Appraisal features.</p>
                                    <button type="submit" id="submit-button">Get Started</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* --- Bottom Action Buttons --- */}
                    <div className="button-holder animate__animated animate__fadeInUp animate__delay-1s" 
                         id="buttons-hide"
                         style={{ display: view === 'home' ? 'flex' : 'none', zIndex: 1 }}>
                        <div className="login-button" onClick={handleLaunchConsole}>Launch Brand Console</div>
                        <div className="join-button" onClick={() => setView('signup')}>Upgrade to Premium</div>
                    </div>

                    <p className="fade-in-delay" id="footer-tag" 
                       style={{ 
                           color: 'rgba(255, 255, 255, 0.541)', 
                           fontSize: '10px', 
                           display: view === 'home' ? 'block' : 'none' 
                       }}>
                        © 2026 brandbased
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;