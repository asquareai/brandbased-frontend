import React from 'react';
import './styles/dashboardHome.css';

const DashboardHome = () => {
    return (
        <div className="landing-grid-wrapper">
            {/* Main Content Area Container */}
            <div className="inner-landing-container">
                
                {/* --- Row 1: Discover & Promote Free --- */}
                <div className="promo-row row-free">
                    
                    {/* Column 1: Descriptive Text and Button */}
                    <div className="col-left text-align-left">
                        <div className="content-placeholder">
                            <h3>Discover & Promote Free</h3>
                            <p>Reach new audiences and build your brand at no cost.</p>
                            
                            <button className="btn-placeholder">
                                <span className="plus">+</span> Start FREE <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Column 2: Visual Interface Preview (Mockup Image) */}
                    <div className="col-middle">
                        <div className="logo-explore-mockup">
                            {/* Assuming you will replace this with a real image asset */}
                            <img src="/assets/images/free-preview.svg" alt="BrandVisual" className="mockup-img" />
                        </div>
                    </div>

                    {/* Column 3: Feature List with Thin Line Separators */}
                    <div className="col-right text-align-left">
                        <div className="list-placeholder thin-lines">
                            <ul>
                                <li><strong>Dynamic Hotspots</strong> – Place interactive product promos anywhere on a page, engaging users without interrupting their browsing.</li>
                                <li><strong>Cross-Page Reach</strong> – Send customers directly to your products from any page, boosting visibility and conversion.</li>
                                <li><strong>Automated Promotions</strong> – Schedule and rotate campaigns seamlessly, keeping your offerings fresh and timely.</li>
                                <li><strong>Freemium Access</strong> – Start using BrandBased with no cost, unlocking key tools to showcase and distribute products instantly.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- Row 2: AI Driven Brand Commerce --- */}
                <div className="promo-row row-premium">
                    
                    {/* Column 1: Descriptive Text and Button */}
                    <div className="col-left text-align-left">
                        <div className="content-placeholder">
                            <h3>AI Driven Brand Commerce</h3>
                            <p>Get on board the first platform that turns static brand mentions into real-time, AI-powered shoppable moments across the internet.</p>
                            
                            <button className="btn-placeholder premium">
                                <span className="plus">+</span> Go Premium <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Column 2: Detailed Interface Mockup (Image) */}
                    <div className="col-middle">
                        <div className="product-display-mockup">
                            {/* Detailed product card visualization asset */}
                            <img src="/assets/images/premium-preview.svg" alt="ProductCardMock" className="mockup-img" />
                        </div>
                    </div>

                    {/* Column 3: Premium Feature List with Thin Line Separators */}
                    <div className="col-right text-align-left">
                        <div className="list-placeholder thin-lines">
                            <ul>
                                <li><strong>The Shopping Cart is Dead</strong> – Redefine e-commerce with AI-driven product discovery and seamless sales.</li>
                                <li><strong>Global Brand Reach</strong> – Get your products in front of customers anywhere, anytime, powered by intelligent placement.</li>
                                <li><strong>Multi-Brand Management</strong> – Manage up to 12 brands from a single platform with ease.</li>
                                <li><strong>Expanded Product Capacity</strong> – Upload up to 7 products per brand, optimizing your catalog for maximum impact.</li>
                                <li><strong>Revenue Sharing & Growth</strong> – Split ad revenue while boosting brand and product discovery worldwide.</li>
                                <li><strong>Stay Pro</strong> – Upgrade to maintain your Premium access and keep unlocking advanced tools and insights.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;