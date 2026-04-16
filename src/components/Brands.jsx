import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/brands.css';

const Brands = () => {

    const navigate = useNavigate();
    
    // --- AUTHENTICATION CHECK ---
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_info');

        if (!savedToken || savedToken === 'null') {
            navigate('/login'); // Secure redirect
            return;
        }

        setToken(savedToken);

        if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserId(user.id);
        }
    }, [navigate]);


    // --- Form State ---
    const [formData, setFormData] = useState({
        brandName: '',
        domain: '',
        lightLogo: null,
        darkLogo: null
    });

    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error when user types
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [type]: file }));
            if (error) setError('');
        }
    };

    const handleContinue = async () => { // Added async
        const { brandName, domain, lightLogo, darkLogo } = formData;

        // --- Client-Side Validation ---
        if (!brandName.trim()) {
            setError('Please enter your Brand Name.');
            return;
        }
        if (!domain.trim() || !domain.includes('.')) {
            setError('Please enter a valid website domain.');
            return;
        }
        if (!lightLogo) {
            setError('Please upload a Light Mode logo.');
            return;
        }
        if (!darkLogo) {
            setError('Please upload a Dark Mode logo.');
            return;
        }

        // Clear previous errors and start UI transition
        setError('');
        setIsVerifying(true); 

        // --- Prepare Data for Laravel ---
        const formDataToSend = new FormData();
        // Using the keys your Laravel $request->validate() expects:
        formDataToSend.append('brand_name', brandName);
        formDataToSend.append('website_url', domain);
        formDataToSend.append('light_logo', lightLogo);
        formDataToSend.append('dark_logo', darkLogo);

        try {
            // Use your .env variable and the /brands route
            const response = await fetch(`${process.env.REACT_APP_API_URL}/brands`, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json',
                    // Important: Do NOT set Content-Type header manually for FormData
                }
            });
            
            const data = await response.json();

            if (response.ok) {
                console.log("Upload Success:", data);
                // The isVerifying state will now trigger the 55% progress bar animation in the UI
            } else {
                // Handle Laravel validation or S3 errors
                setError(data.main_message || 'Upload failed. Please check your file formats.');
                setIsVerifying(false);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            setError('Could not connect to the server. Please check your API URL.');
            setIsVerifying(false);
        }
    };

    return (
        <div className="brands-container animate__animated animate__fadeIn">
            {/* Column 1: Brand Configuration */}
            <div className="brands-col-left">
                <h3 className="brands-title">Your Brand</h3>
                
                <div className="brands-form-wrapper">
                    {error && <div className="validation-error-msg">{error}</div>}

                    <div className="brands-input-group">
                        <input 
                            name="brandName"
                            type="text" 
                            className="brands-main-input brand-name-placeholder" 
                            placeholder="Brand name (we replace this with your logo)" 
                            onChange={handleInputChange}
                        />
                        <div className="brands-tooltip-wrapper">
                            <span className="brands-info-circle">ⓘ</span>
                            <span className="tooltip-text">Used for store profile identification.</span>
                        </div>
                    </div>

                    <div className="brands-input-group">
                        <input 
                            name="domain"
                            type="text" 
                            className="brands-main-input" 
                            placeholder="Enter your brand website domain name" 
                            onChange={handleInputChange}
                        />
                        <div className="brands-tooltip-wrapper">
                            <span className="brands-info-circle">ⓘ</span>
                            <span className="tooltip-text">Example: brandbased.io</span>
                        </div>
                    </div>

                    <div className="brands-upload-container">
                        <p className="brands-upload-text">Upload your brand logo</p>
                        <div className="brands-upload-grid">
                            
                            {/* Light Mode Upload */}
                            <label className="brands-upload-item">
                                <input type="file" accept=".svg,.eps" hidden onChange={(e) => handleFileChange(e, 'lightLogo')} />
                                <div className={`brands-upload-box light-box ${formData.lightLogo ? 'uploaded' : ''}`}>
                                    <div className="brands-plus-icon">{formData.lightLogo ? '✓' : '+'}</div>
                                    <span className="brands-format-text">{formData.lightLogo ? formData.lightLogo.name : 'SVG or EPS format'}</span>
                                </div>
                                <span className="brands-label-text">Light Mode Logo</span>
                            </label>

                            {/* Dark Mode Upload */}
                            <label className="brands-upload-item">
                                <input type="file" accept=".svg,.eps" hidden onChange={(e) => handleFileChange(e, 'darkLogo')} />
                                <div className={`brands-upload-box dark-box ${formData.darkLogo ? 'uploaded' : ''}`}>
                                    <div className="brands-plus-icon">{formData.darkLogo ? '✓' : '+'}</div>
                                    <span className="brands-format-text">{formData.darkLogo ? formData.darkLogo.name : 'SVG or EPS format'}</span>
                                </div>
                                <span className="brands-label-text">Dark Mode Logo</span>
                                <div className="brands-tooltip-wrapper upload-info">
                                    <span className="brands-info-circle">ⓘ</span>
                                    <span className="tooltip-text">Ensure high contrast for dark backgrounds.</span>
                                </div>
                            </label>

                        </div>
                    </div>

                    <button className="brands-btn-continue" onClick={handleContinue}>Continue</button>
                </div>
            </div>

            {/* Column 2: Brand Identity Verification */}
            <div className="brands-col-right">
                <div className="vertical-divider"></div>
                {/* ... (Previous Preview Code) ... */}
            </div>
        </div>
    );
};

export default Brands;