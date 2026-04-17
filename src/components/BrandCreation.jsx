import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/BrandCreation.css';

const BrandCreation = ({ setActiveTab, existingBrand }) => {
    // Determine if we are in "View Mode" (resuming) or "Create Mode"
    const isReadOnly = !!existingBrand;

    const navigate = useNavigate();
    
    // --- AUTHENTICATION CHECK ---
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_info');

        if (!savedToken || savedToken === 'null') {
            navigate('/login');
            return;
        }

        setToken(savedToken);

        if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserId(user.id);
        }
    }, [navigate]);

    // --- Form State ---
    // Initialize with existingBrand data if available
    const [formData, setFormData] = useState({
        brandName: existingBrand?.brand_name || '',
        domain: existingBrand?.website_url || '',
        lightLogo: null,
        darkLogo: null
    });

    const [error, setError] = useState('');
    
    // Initialize verifyingBrand with existingBrand to show progress immediately
    const [verifyingBrand, setVerifyingBrand] = useState(existingBrand || null); 
    const [isVerifying, setIsVerifying] = useState(!!existingBrand);

    useEffect(() => {
        if (existingBrand) {
            setVerifyingBrand(existingBrand);
            
            // If the backend says it's verified, make sure our local 
            // form data also reflects the latest names/URLs
            setFormData(prev => ({
                ...prev,
                brandName: existingBrand.brand_name || prev.brandName,
                domain: existingBrand.website_url || prev.domain
            }));
        }
    }, [existingBrand]); // This triggers every time Dashboard's polling finishes

    // --- Handlers ---
    const handleInputChange = (e) => {
        if (isReadOnly) return; // Prevent typing if read-only
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleFileChange = (e, type) => {
        if (isReadOnly) return;
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [type]: file }));
            if (error) setError('');
        }
    };

    const handleContinue = async () => {
        const { brandName, domain, lightLogo, darkLogo } = formData;
        
        const savedUser = localStorage.getItem('user_info');
        let user = null;
        try { user = savedUser ? JSON.parse(savedUser) : null; } catch (e) {}

        if (!user || !user.id) {
            setError('Your session has expired. Please log in again.');
            return;
        }

        if (!brandName.trim()) { setError('Please enter your Brand Name.'); return; }
        if (!domain.trim() || !domain.includes('.')) { setError('Please enter a valid website domain.'); return; }
        if (!lightLogo) { setError('Please upload a Light Mode logo.'); return; }
        if (!darkLogo) { setError('Please upload a Dark Mode logo.'); return; }

        setError('');
        setIsVerifying(true); 

        const formDataToSend = new FormData();
        formDataToSend.append('brand_name', brandName);
        formDataToSend.append('website_url', domain);
        formDataToSend.append('light_logo', lightLogo);
        formDataToSend.append('dark_logo', darkLogo);
        formDataToSend.append('user_id', user.id);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/brands`, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();

            if (response.ok) {
                setVerifyingBrand(data.brand); 
                setIsVerifying(true); 
            } else {
                const serverError = data.main_message || (data.errors ? Object.values(data.errors)[0][0] : 'Upload failed.');
                setError(serverError);
                setIsVerifying(false);
            }
        } catch (err) {
            setError('Could not connect to the server.');
            setIsVerifying(false);
        }
    };

    const isIdentityVerified = verifyingBrand?.identity_status === 'verified';
    

    return (
        <div className="brands-container animate__animated animate__fadeIn">
            
            {/* --- LEFT COLUMN: FORM OR META INSTRUCTIONS --- */}
            <div className="brands-col-left">
                <button className="back-to-dashboard-btn" onClick={() => setActiveTab('Start Now')}>
                    ← Back to Dashboard
                </button>

                {!isIdentityVerified ? (
                    /* STAGE 1 UI: THE FORM */
                    <div className="setup-stage">
                        <h3 className="brands-title">{isReadOnly ? 'Brand Verification' : 'Create Your Brand'}</h3>
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
                ) : (
                    /* STAGE 2 UI: WEBSITE VERIFICATION (Hides the form) */
                    <div className="verification-panel animate__animated animate__fadeIn">
                        <h2 className="panel-brand-header">Your Brand</h2>
                        <h3 className="panel-main-title">You're almost there!</h3>
                        
                        <p className="panel-description">
                            Please paste your official BrandBased verification meta tag and runtime load into the <code>&lt;head&gt;</code> of your website to complete the brand verification process. 
                            <span className="info-badge">i</span>
                        </p>

                        <div className="code-block-container">
                            <div className="code-block-header">
                                <span className="code-lang">🔗 HTML</span>
                                <button 
                                    className="copy-btn-minimal" 
                                    onClick={() => navigator.clipboard.writeText(`<meta name="brandbased-official" content="BB-VERIFIED-${verifyingBrand.meta_verification_code}">`)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                </button>
                            </div>
                            <div className="code-block-body">
                                <code className="code-comment">{``}</code>
                                <br />
                                <code className="code-tag">
                                    {`<meta name="brandbased-official" content="BB-VERIFIED-${verifyingBrand.meta_verification_code}">`}
                                </code>
                            </div>
                        </div>

                        <p className="panel-footer-text">
                            After adding your BrandBased verification meta tag and runtime loader to your site's <code>&lt;head&gt;</code>, click Sync to finish verification.
                        </p>

                        <button className="sync-action-btn" onClick={() => console.log("Syncing...")}>
                            Sync
                        </button>
                    </div>
                )}
            </div>

            {/* --- RIGHT COLUMN: STATUS AND PROGRESS --- */}
            <div className="brands-col-right">
                <div className="vertical-divider"></div>
                
                <div className="verification-status-container">
                    {!isIdentityVerified ? (
                        /* Standard Progress View */
                        <div className="progress-loading-view">
                            <h3 className="success-header">Brand Identity Verification </h3>
                            <div className="logo-preview-wrapper">
                                <img src={verifyingBrand?.logo_dark_url} alt="Brand" />
                            </div>
                            <div className="progress-bar-area">
                                <div className="progress-labels">
                                    <span>Verifying Identity</span>
                                    <span>{verifyingBrand?.identity_progress || 0}%</span>
                                </div>
                                <div className="progress-track">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${verifyingBrand?.identity_progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* SUCCESS VIEW (Matching your image) */
                        <div className="identity-success-view animate__animated animate__zoomIn">
                            <h3 className="success-header">Brand Identity Verification</h3>
                            
                            <div className="success-logo-container">
                                <img 
                                    src={verifyingBrand?.logo_dark_url} 
                                    className="main-success-logo" 
                                    alt="Verified Logo" 
                                />
                                <div className="green-check-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="4">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>

                            <p className="success-status-text">Your brand has been verified!</p>

                            <button 
                                className="continue-settings-btn" 
                                onClick={() => setActiveTab('Brands')}
                            >
                                Continue to Brand Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandCreation;