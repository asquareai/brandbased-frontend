import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/dashboard.css';
import Brands from '../../components/Brands';
import DashboardHome from '../../components/DashboardHome';

// --- Sub-Component Placeholders ---
// In a real project, move these to separate files like ./sections/Brands.jsx
const Platforms = () => <div className="tab-pane"><h3>Connected Platforms</h3><p>Shopify, WooCommerce, Amazon...</p></div>;
const Products = () => <div className="tab-pane"><h3>Product Catalog</h3><p>Manage AI-synced product listings...</p></div>;
const Payments = () => <div className="tab-pane"><h3>Financial Overview</h3><p>Transaction history and payouts...</p></div>;
const Hotspots = () => <div className="tab-pane"><h3>Interactive Hotspots</h3><p>Configure shoppable touchpoints...</p></div>;
const AiLogic = () => <div className="tab-pane"><h3>AI Engine Settings</h3><p>Configure GPT-4 and automation rules...</p></div>;
const Settings = () => <div className="tab-pane"><h3>Account Settings</h3><p>Update brand identity and profile...</p></div>;
const Campaigns = () => <div className="tab-pane"><h3>Marketing Campaigns</h3><p>Track performance and reach...</p></div>;
const Metrics = () => <div className="tab-pane"><h3>Analytics Dashboard</h3><p>Real-time data visualization...</p></div>;

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
        { id: 'start', label: 'Start Now', icon: 'start.svg', component: <DashboardHome /> },
        { id: 'brands', label: 'Brands', icon: 'brands.svg', component: <Brands /> },
        { id: 'onboard-platform', label: 'Platforms', icon: 'platforms.svg', component: <Platforms /> },
        { id: 'productsd', label: 'Products', icon: 'products.svg', component: <Products /> },
        { id: 'payments', label: 'Payments', icon: 'payments.svg', component: <Payments /> },
        { id: 'hotspots', label: 'Hotspots', icon: 'hotspots.svg', component: <Hotspots /> },
        { id: 'ai-logic', label: 'AI-Logic', icon: 'ai-logic.svg', component: <AiLogic /> },
        { id: 'brand-settings', label: 'Brand Settings', icon: 'settings.svg', component: <Settings /> },
        { id: 'campaigns', label: 'Campaigns', icon: 'campaigns.svg', component: <Campaigns /> },
        { id: 'metrics', label: 'Metrics', icon: 'Metrics.svg', component: <Metrics /> },
    ];

    // Helper to find the component based on activeTab label
    const getActiveComponent = () => {
        const item = navItems.find(nav => nav.label === activeTab);
        return item ? item.component : <Brands />;
    };

    return (
        <div className="screen" id="screen2" style={{ display: 'flex' }}>
            
            {/* ---------- Header ----------- */}
            <div className="header-nav">
                <div className="header-logo animate__animated animate__slideInDown" id="header-logo-mobile">
                    <img className="bb-typefaceImgMobile" src="/assets/images/BB-TYPEFACE-LOGO-white.svg" alt="Logo" />
                </div>
                
                <div className="header-logo-desktop animate__animated animate__fadeInLeft" id="header-icon-desktop">
                    <img 
                        src="/assets/images/b-white.svg" 
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

            {/* ---------- Mobile Navigation Overlay ----------- */}
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

            {/* ---------- Mobile Quick Bar ----------- */}
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

            {/* ---------- Main Content Area ----------- */}
            <div className="content-block">
                <div key={activeTab} className="animate__animated animate__slideInUp content-inner-wrapper">
                    <h2 id="content-heading">{activeTab}</h2>
                    {/* This wrapper will now handle the scrolling */}
                    <div className="dynamic-content-scroll-area">
                        {getActiveComponent()}
                    </div>
                </div>
            </div>
            {/* ---------- Footer ----------- */}
            <div className="footer-bar-brand-console animate__animated animate__slideInUp" id="console-desktop-footer-bar">
                <div className="footer-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="footer-b-icon">
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