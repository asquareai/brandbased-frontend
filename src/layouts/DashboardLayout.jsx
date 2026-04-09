import React, { useState } from 'react';

const DashboardLayout = ({ children, userEmail }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    return (
        <div className="dashboard-wrapper">
            {/* Background Shards */}
            <div className="light-shard-ui-base">
                <div className="light-shard-ui-theme"></div>
                <div className="light-shard-ui-theme" style={{ "--delay": "-12s", "--size": "0.35", "--speed": "45s" }}></div>
                <div className="light-shard-ui-theme" style={{ "--delay": "-10s", "--size": "0.3", "--speed": "30s" }}></div>
            </div>

            {/* Top Navigation */}
            <header className="header-nav">
                <div className="header-logo-desktop">
                    <img src="/assets/images/b-white.svg" alt="logo" id="white-icon" className="shine-double" />
                </div>
                <div className="bb-typeface">
                    <img src="/assets/images/BB-TYPEFACE-LOGO-white.svg" alt="BrandBased" />
                </div>

                <div className="account-section">
                    <div className="account" onClick={() => setIsAccountOpen(!isAccountOpen)}>
                        <p id="account-title">{userEmail || 'Account'}</p>
                        <img src="/assets/images/account-placeholder.svg" alt="Profile" />
                    </div>

                    {isAccountOpen && (
                        <div className="account-popup animate__animated animate__fadeIn">
                            <div className="logout-button" onClick={() => {
                                localStorage.removeItem('auth_token');
                                window.location.href = '/login';
                            }}>
                                Log Out
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Sidebar Navigation */}
            <nav className="nav-container">
                <NavItem icon="brands.svg" label="Brands" />
                <NavItem icon="platforms.svg" label="Platforms" />
                <NavItem icon="products.svg" label="Products" />
                <NavItem icon="payments.svg" label="Payments" />
                <NavItem icon="ai-logic.svg" label="AI-Logic" id="custom-ai-logic-size" />
                <NavItem icon="settings.svg" label="Settings" />
            </nav>

            {/* Main Content Area */}
            <main className="content-block animate__animated animate__slideInUp">
                {children}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, id }) => (
    <div className="nav-item" id={id}>
        <img src={`/assets/images/${icon}`} alt={label} />
        <p>{label}</p>
    </div>
);

export default DashboardLayout;