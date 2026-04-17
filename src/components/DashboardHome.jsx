import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/dashboardHome.css';

const DashboardHome = ({ setActiveTab, brands = [] }) => {
    const navigate = useNavigate();
    
    // --- Dashboard State ---
    const [userPlan, setUserPlan] = useState('free'); // Default to free
    
    const pendingBrandData = brands.find(brand => brand.status === 'pending');
    const hasPendingBrand = !!pendingBrandData;
    const brandCount = brands.length;

   

    // --- Action Handler ---
    const handleStartBrand = () => {
      if (hasPendingBrand) {
            setActiveTab('Brand Creation', pendingBrandData);
            return;
        }
        if (brandCount >= 12) {
            alert("Limit reached.");
            return;
        }
        setActiveTab('Brand Creation');
    };
    return (
        <div className="landing-grid-wrapper">
            <div className="inner-landing-container">
                
                {/* --- Row 1: Discover & Promote Free (ONLY SHOW IF USER IS FREE) --- */}
                {userPlan === 'free' && (
                    <div className="promo-row row-free animate__animated animate__fadeIn">
                        <div className="col-left text-align-left">
                            <div className="content-placeholder">
                                <h3>Discover & Promote Free</h3>
                                <p>Reach new audiences and build your brand at no cost.</p>
                               <button className="btn-placeholder" onClick={handleStartBrand}>
                                    <span className="plus">+</span> 
                                    {hasPendingBrand ? 'View Progress' : 'Start FREE'} 
                                    <span className="arrow">→</span>
                                </button>
                            </div>
                        </div>
                        {/* ... keep your existing col-middle and col-right exactly as they are ... */}
                        <div className="col-middle">
                             <div className="logo-explore-mockup">
                                 <img src="/assets/images/free-preview.svg" alt="BrandVisual" className="mockup-img" />
                             </div>
                        </div>
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
                )}

                {/* --- Row 2: AI Driven Brand Commerce (SHOW ALWAYS) --- */}
                <div className="promo-row row-premium">
                    <div className="col-left text-align-left">
                        <div className="content-placeholder">
                            <h3>AI Driven Brand Commerce</h3>
                            <p>{userPlan === 'premium' ? "Manage your premium brands and expand your global reach." : "Get on board the first platform that turns static brand mentions into shoppable moments."}</p>
                            
                            <button className="btn-placeholder premium" onClick={handleStartBrand}>
                                <span className="plus">+</span> {userPlan === 'premium' ? 'Add Premium Brand' : 'Go Premium'} <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                    {/* ... keep your existing col-middle and col-right exactly as they are ... */}
                    <div className="col-middle">
                         <div className="product-display-mockup">
                             <img src="/assets/images/premium-preview.svg" alt="ProductCardMock" className="mockup-img" />
                         </div>
                    </div>
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