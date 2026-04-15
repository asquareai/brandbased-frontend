import React from 'react';
import './styles/dashboardHome.css';

const DashboardHome = () => {
    return (
        <div className="landing-grid-wrapper">
            
            {/* --- Row 1: Discover & Promote Free --- */}
            <div className="promo-row row-free">
                <div className="col-left text-align-left">
                    <div className="content-placeholder">
                        <h2>Discover & Promote Free</h2>
                        <p>Reach new audiences and build your brand at no cost.</p>
                        <div className="image-button-wrapper" onClick={() => console.log("Freemium Clicked")}>
                            <img 
                                src="/assets/images/fremium-button.svg" 
                                alt="Start FREE" 
                                className="freemium-btn-img" 
                            />
                        </div>
                    </div>
                </div>

               <div className="col-middle">
                    {/* Placeholder for your static Product Preview image */}
                    <div className="product-mock-static">
                        <img src="/assets/images/free-preview.svg" alt="Product Preview" />
                    </div>
                </div>

                <div className="col-right">
                    <div className="list-container-box">
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
            <div className="promo-row2 row-premium">
                <div className="col-left text-align-left">
                    <div className="content-placeholder">
                        <h2>AI Driven Brand Commerce</h2>
                        <p>Get on board the first platform that turns static brand mentions into real-time, AI-powered shoppable moments.</p>
                        <div className="image-button-wrapper" onClick={() => console.log("Freemium Clicked")}>
                            <img 
                                src="/assets/images/premium-button.svg" 
                                alt="Start FREE" 
                                className="freemium-btn-img" 
                            />
                        </div>
                    </div>
                </div>

                <div className="col-middle">
                    {/* Placeholder for your static Product Preview image */}
                    <div className="product-mock-static">
                        <img src="/assets/images/premium-preview.svg" alt="Product Preview" />
                    </div>
                </div>

                <div className="col-right">
                    <div className="list-container-box">
                        <ul>
                            <li><strong>The Shopping Cart is Dead</strong> – Redefine e-commerce with AI-driven product discovery and seamless sales.</li>
                            <li><strong>Global Brand Reach</strong> – Get your products in front of customers anywhere, anytime, powered by intelligent placement.</li>
                            <li><strong>Multi-Brand Management</strong> – Manage up to 12 brands from a single platform with ease.</li>
                            <li><strong>Expanded Product Capacity</strong> – Upload up to 7 products per brand, optimizing your catalogue for maximum impact.</li>
                            <li><strong>Revenue Sharing &amp; Grouwth</strong> – Split ad revenue while boosting brand and product discovery worldwide.</li>
                            <li><strong>Stay Pro</strong> – Upgrade to maintain your Premium access and keep unlocking advanced tools and insights.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardHome;