import React, { useState } from 'react';
import './styles/brands.css';

const Brands = () => {
    // Sample state - later this will come from your MySQL/PHP backend
    const [brands, setBrands] = useState([
        { id: 1, name: 'EcoStyle', industry: 'Fashion', status: 'Active', logo: 'B' },
        { id: 2, name: 'TechNova', industry: 'Electronics', status: 'Active', logo: 'T' },
        { id: 3, name: 'HealthFirst', industry: 'Wellness', status: 'Pending', logo: 'H' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="brands-container">
            {/* Action Bar */}
            <div className="brands-header">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Search brands..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-brand-btn">
                    <span>+</span> New Brand
                </button>
            </div>

            {/* Brands Grid */}
            <div className="brands-grid">
                {filteredBrands.map(brand => (
                    <div key={brand.id} className="brand-card">
                        <div className="brand-card-top">
                            <div className="brand-logo-circle">{brand.logo}</div>
                            <div className={`status-badge ${brand.status.toLowerCase()}`}>
                                {brand.status}
                            </div>
                        </div>
                        <div className="brand-info">
                            <h3>{brand.name}</h3>
                            <p>{brand.industry}</p>
                        </div>
                        <div className="brand-card-actions">
                            <button className="edit-btn">Edit</button>
                            <button className="view-btn">Console</button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Card */}
                <div className="brand-card add-card-dashed">
                    <div className="add-icon">+</div>
                    <p>Onboard New Entity</p>
                </div>
            </div>
        </div>
    );
};

export default Brands;