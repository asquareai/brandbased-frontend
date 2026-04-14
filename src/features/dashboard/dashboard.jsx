import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/dashboard.css'; // Copy your brand-console-styles.css content here

const Dashboard = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Start Now');
    const [isShining, setIsShining] = useState(false);
    // Theme Toggle Logic
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme === 'light');
    }, []);

    const applyTheme = (isLight) => {
        document.body.classList.toggle('light-mode', isLight);
        setIsDarkMode(!isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    const navItems = [
        { id: 'brands', label: 'Brands', icon: 'brands.svg' },
        { id: 'onboard-platform', label: 'Platforms', icon: 'platforms.svg' },
        { id: 'productsd', label: 'Products', icon: 'products.svg' },
        { id: 'payments', label: 'Payments', icon: 'payments.svg' },
        { id: 'hotspots', label: 'Hotspots', icon: 'hotspots.svg' },
        { id: 'ai-logic', label: 'AI-Logic', icon: 'ai-logic.svg' },
        { id: 'brand-settings', label: 'Brand Settings', icon: 'settings.svg' },
        { id: 'campaigns', label: 'Campaigns', icon: 'campaigns.svg' },
        { id: 'metrics', label: 'Metrics', icon: 'Metrics.svg' },
    ];

    return (
        <div className="screen" id="screen2" style={{ display: 'flex' }}>
            
            {/* ---------- Header ----------- */}
            <div className="header-nav">
                <div className="header-logo animate__animated animate__slideInDown" id="header-logo-mobile">
                    <img className="bb-typefaceImgMobile"src="/assets/images/BB-TYPEFACE-LOGO-white.svg" alt="Logo" />
                </div>
                <div className="header-logo-desktop animate__animated animate__fadeInLeft" id="header-icon-desktop">
                    <img 
                        src="/assets/images/b-white.svg" 
                        /* Added bb-typefaceImgBIcon to target it specifically */
                        className={`white-icon bb-typefaceImgBIcon ${isShining ? 'shine-double' : ''}`} 
                        alt="B Icon" 
                        style={{ width: '40px', height: '40px' }} 
                    />
                </div>
                <div className="bb-typeface animate__animated animate__slideInDown">
                    <img className="bb-typefaceImg" src="/assets/images/BB-TYPEFACE-LOGO-white.svg" alt="BrandBased" />
                </div>

                <div className="account-section">
                    <div id="account-popup">
                        <div className="theme-toggle-container">
                            <span className="theme-label">{isDarkMode ? "Theme Dark" : "Theme Light"}</span>
                            <label className="theme-button">
                                <input 
                                    type="checkbox" 
                                    checked={!isDarkMode} 
                                    onChange={(e) => applyTheme(e.target.checked)} 
                                />
                                <div className="knobs"></div>
                                <div className="layer"></div>
                            </label>
                        </div>
                        <div className="logout-button" onClick={handleLogout}>Log Out</div>
                    </div>
                    
                    <div className="account">
                        <p id="account-title">Account</p>
                        <img src="/assets/images/account-placeholder.svg" alt="Account" />
                    </div>
                </div>
                <div className="get-premium">Get Premium</div>
                <div id="animate-header-line"></div>
            </div>

            {/* ---------- Sidebar (Desktop) ----------- */}
            <div className="nav-container">
                {navItems.map((item) => (
                    <div 
                        key={item.id} 
                        className={`nav-item ${activeTab === item.label ? 'active' : ''}`} 
                        onClick={() => setActiveTab(item.label)}
                    >
                        <img src={`/assets/images/${item.icon}`} alt={item.label} />
                        <p>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* ---------- Mobile Navigation ----------- */}
            <footer className={`mobile-footer-nav ${isMobileNavOpen ? 'open' : ''}`}>
                <div className="close-mobile-nav" onClick={() => setIsMobileNavOpen(false)}>
                    <img src="/assets/images/close-nav-icon.svg" alt="Close" />
                </div>
                <div className="footer-grid">
                    {navItems.map((item) => (
                        <div key={item.id} className="footer-item" onClick={() => {setActiveTab(item.label); setIsMobileNavOpen(false);}}>
                            <img src={`/assets/images/${item.icon}`} alt={item.label} />
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
            </footer>

            <div className="mobile-footer-bar">
                <div className="mobile-footer-bar-item" onClick={() => setActiveTab('Brands')}>
                    <img src="/assets/images/brands-blue-mobile-footer.svg" alt="Brands" />
                </div>
                <div className="mobile-footer-bar-item" id="open-footer-nav" onClick={() => setIsMobileNavOpen(true)}>
                    <img src="/assets/images/ai-logic.svg" width="40px" height="40px" alt="Menu" />
                </div>
                <div className="mobile-footer-bar-item" onClick={() => setActiveTab('Brand Settings')}>
                    <img src="/assets/images/settings-blue-mobile-footer.svg" alt="Settings" />
                </div>
            </div>

            {/* ---------- Main Content ----------- */}
            <div className="content-block animate__animated animate__slideInUp">
                <h2 id="content-heading">{activeTab}</h2>
                
            </div>

            {/* ---------- Footer ----------- */}
            <div className="footer-bar-brand-console animate__animated animate__slideInUp" id="console-desktop-footer-bar">
            <div className="footer-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="footer-b-icon">
                    {/* The CSS rule above targets this image directly */}
                    <img src="/assets/images/b-white.svg" width="17" height="17" alt="B" />
                </div>
                <h5>© 2026 BrandBased · AI Commerce Platform · Brand Support</h5>
            </div>
        </div>
            {/* Background Animation Shards */}
            <div className="light-shard-ui-base">
                <div className="light-shard-ui-theme"></div>
                <div className="light-shard-ui-theme" style={{'--delay': '-12s', '--size': '0.35', '--speed': '45s'}}></div>
            </div>
        </div>
    );
};

export default Dashboard;