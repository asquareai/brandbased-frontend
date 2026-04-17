import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/dashboard.css';
import Brands from '../../components/BrandCreation';
import DashboardHome from '../../components/DashboardHome';
import BrandCreation from '../../components/BrandCreation'; 

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

localStorage.setItem('theme', 'light');
const Dashboard = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Start Now');
    const [isShining, setIsShining] = useState(false);

    
    const [brands, setBrands] = useState([]); // This holds ALL user brands
    const [selectedBrand, setSelectedBrand] = useState(null); // This holds the one being viewed
    const fetchBrands = useCallback(async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/brands`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setBrands(data.brands || []);
                    console.log("Brands Refreshed:", data.brands);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, []);

        useEffect(() => {
            fetchBrands();
        }, [fetchBrands]);

        useEffect(() => {
            const interval = setInterval(() => {
                fetchBrands();
            }, 5000); 
            return () => clearInterval(interval);
        }, [fetchBrands]);

        // THE SYNC BRIDGE: Updates the selected brand view when polling finds changes
        useEffect(() => {
            if (selectedBrand) {
                const updated = brands.find(b => b.id === selectedBrand.id);
                if (updated) {
                    setSelectedBrand(updated);
                }
            }
        }, [brands]);

    

    const applyTheme = (isLight) => {
        const themeValue = isLight ? 'light' : 'dark';
        
        setIsDarkMode(!isLight);
        document.documentElement.setAttribute('data-theme', themeValue);
        document.body.classList.toggle('light-mode', isLight);
        localStorage.setItem('theme', themeValue);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    const handleTabChange = (tabLabel, brandData = null) => {
        setSelectedBrand(brandData); 
        setActiveTab(tabLabel);
    };

    // Keep your name 'navItems' but use it for UI data only
    const navItems = [
        { id: 'start', label: 'Start Now', icon: 'start.svg' },
        { id: 'brand-create', label: 'Brand Creation', icon: 'brands.svg' },
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

    // This dynamically renders the component with the LATEST selectedBrand state
    const getActiveComponent = () => {
        switch (activeTab) {
            case 'Start Now':
                return <DashboardHome brands={brands} setActiveTab={handleTabChange} />;
            case 'Brand Creation':
                return <BrandCreation existingBrand={selectedBrand} setActiveTab={handleTabChange} />;
            case 'Brands': return <Brands />;
            case 'Platforms': return <Platforms />;
            case 'Products': return <Products />;
            case 'Payments': return <Payments />;
            case 'Hotspots': return <Hotspots />;
            case 'AI-Logic': return <AiLogic />;
            case 'Brand Settings': return <Settings />;
            case 'Campaigns': return <Campaigns />;
            case 'Metrics': return <Metrics />;
            default: return <DashboardHome brands={brands} setActiveTab={handleTabChange} />;
        }
    };

    return (
        <div className="screen" id="screen2" style={{ display: 'flex' }}>
            
            {/* ---------- Header ----------- */}
            <div className="header-nav">
                <div className="header-logo animate__animated animate__slideInDown" id="header-logo-mobile">
                    {/* Note: In light mode, you might want a dark version of this logo */}
                    <img className="bb-typefaceImgMobile" src={isDarkMode ? "/assets/Brandbased-icon-white.svg" : "/assets/Brandbased-icon.svg"} alt="Logo" />
                </div>
                
                <div className="header-logo-desktop animate__animated animate__fadeInLeft" id="header-icon-desktop">
                    <img 
                        src={isDarkMode ? "/assets/Brandbased-icon-white.svg" : "/assets/Brandbased-icon.svg"} 
                        className={`bb-typefaceImgBIcon ${isShining ? 'shine-double' : ''}`} 
                        alt="B Icon" 
                        style={{ width: '40px', height: '40px' }} 
                    />
                </div>

                <div className="bb-typeface animate__animated animate__slideInDown">
                    <img className="bb-typefaceImg" src={isDarkMode ? "/assets/Brandbased-Typeface-white.svg" : "/assets/Brandbased-Typeface.svg"} alt="BrandBased" />
                </div>

                <div className="account-section">
                    <div id="account-popup">
                        <div className="theme-toggle-container">
                            <span className="theme-label">{isDarkMode ? "Theme Dark" : "Theme Light"} tested</span>
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
                        {/* If you have blue/dark icons, you can switch them here */}
                        <img src={`/assets/images/${item.icon}`} alt={item.label} />
                        <p>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* ... Rest of the Footer/Mobile Nav remains the same ... */}

            {/* ---------- Main Content Area ----------- */}
            <div className="content-block">
                <div key={activeTab} className="animate__animated animate__slideInUp content-inner-wrapper">
                    <h2 id="content-heading">{activeTab}</h2>
                    <div className="dynamic-content-scroll-area">
                        {getActiveComponent()}
                    </div>
                </div>
            </div>

            {/* ---------- Footer ----------- */}
            <div className="footer-bar-brand-console animate__animated animate__slideInUp" id="console-desktop-footer-bar">
                <div className="footer-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="footer-b-icon">
                        <img src={isDarkMode ? "/assets/images/b-white.svg" : "/assets/images/b-blue.svg"} width="17" height="17" alt="B" />
                    </div>
                    <h5>© 2026 BrandBased · AI Commerce Platform · Brand Support</h5>
                </div>
            </div>

            {/* Background Animation Shards - Silently hidden in light mode for better text contrast */}
            {!isDarkMode ? null : (
                <div className="light-shard-ui-base">
                    <div className="light-shard-ui-theme"></div>
                    <div className="light-shard-ui-theme" style={{'--delay': '-12s', '--size': '0.35', '--speed': '45s'}}></div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;