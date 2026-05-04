import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/BrandCreation.css';

const BrandCreation = ({ setActiveTab }) => {
    const navigate = useNavigate();
    
    const [token] = useState(localStorage.getItem('auth_token'));
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    const [formData, setFormData] = useState({
        brandName: '',
        domain: '',
        lightLogo: null,
        darkLogo: null
    });

    const [error, setError] = useState('');
    const [verifyingBrand, setVerifyingBrand] = useState(null); 
    const [isVerifying, setIsVerifying] = useState(false);
    
    const [visualSeconds, setVisualSeconds] = useState(0);
    const [visualMetaSeconds, setVisualMetaSeconds] = useState(0); 
    const totalDuration = 120; 

    const fetchActiveBrand = useCallback(async (authToken, isPolling = false, specificId = null) => {
        if (!isPolling) setIsLoading(true);
        try {
            // Decide which URL to use
            const url = specificId 
                ? `${process.env.REACT_APP_API_URL}/brands/${specificId}` // Get specific brand
                : `${process.env.REACT_APP_API_URL}/brands/pending`;      // Look for latest pending
                
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            const brandData = data.brand;
            console.log('brand data ' + brandData);

            if (response.ok && brandData) {
                setVerifyingBrand(brandData);
                setIsVerifying(true); 
                 setFormData({
                    brandName: brandData.brand_name || '',
                    domain: brandData.website_url || '',
                    lightLogo: null,  
                    darkLogo: null,
                    identityProgress:0,
                    brandUniqueId:brandData.brand_unique_id || ''
                });
                
                // ... (keep your existing timer sync logic here) ...
                
            } else if (response.ok && !brandData && !isPolling) {
                // No brand found at all, reset UI to "Create" mode
                setVerifyingBrand(null);
                setIsVerifying(false);
                // Sync Identity Timer to DB Percentage
                const dbIdProgress = parseInt(brandData.identity_progress) || 0;
                setVisualSeconds(currentSecs => {
                    const dbSecs = Math.round((dbIdProgress / 100) * totalDuration);
                    // If DB is ahead of our local visual timer, jump to DB value
                    return dbSecs > currentSecs ? dbSecs : currentSecs;
                });

                // Sync Meta Timer to DB Percentage
                const dbMetaProgress = parseInt(brandData.meta_progress) || 0;
                setVisualMetaSeconds(currentSecs => {
                    const dbSecs = Math.round((dbMetaProgress / 100) * totalDuration);
                    return dbSecs > currentSecs ? dbSecs : currentSecs;
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            if (!isPolling) setIsLoading(false);
        }
    }, [totalDuration]);

   useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_info');

        if (!savedToken) {
            navigate('/login');
            return;
        }

        // Initial Load: Look for any pending brand
        if (savedUser) {
            fetchActiveBrand(savedToken);
        }

        const pollId = setInterval(() => {
            // Look at the current state - if we already have a brand ID, 
            // poll THAT specific ID instead of the general "pending" list.
            const currentBrandId = verifyingBrand?.id; 
            fetchActiveBrand(savedToken, true, currentBrandId);
        }, 10000);

        return () => clearInterval(pollId);
        // Add verifyingBrand?.id to dependencies so the interval can "see" the ID change
    }, [navigate, fetchActiveBrand, verifyingBrand?.id]);


    const handleVerifyWebsite = async () => {
        if (!verifyingBrand?.id) return;

        try {
            setIsVerifying(true);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/internal/brands/${verifyingBrand.id}/verify-website`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Internal-Token': 'change-me' // ⚠️ important
                    }
                }
            );

            const data = await response.json();

            console.log("Verification Response:", data);

            // After verification → refresh latest data
            fetchActiveBrand(token, true, verifyingBrand.id);

        } catch (err) {
            console.error("Verification error:", err);
        } finally {
            setIsVerifying(false);
        }
    };

    // --- 3. IMPROVED DERIVED STATES ---
    const idStatus = verifyingBrand?.identity_status?.toLowerCase() || 'pending';
    const metaStatus = verifyingBrand?.meta_status?.toLowerCase() || 'pending';
    
    const isIdVerified = idStatus === 'verified';
    const isIdInProgress = (idStatus === 'inprogress' || idStatus === 'pending');
    const isIdUnderReview = idStatus === 'under review';
    const isIdRejected = idStatus === 'flagged';

    const isMetaVerified = metaStatus === 'verified';
    const isMetaInProgress = metaStatus === 'inprogress';
    const isMetaUnderReview = metaStatus === 'under review';
    const isMetaRejected = metaStatus === 'failed';
console.log("meta status " + metaStatus);
    const isReadOnly = !!verifyingBrand; 

    const identityNotes = verifyingBrand?.identity_verification_notes;
    const websiteNotes = verifyingBrand?.meta_verification_notes;

    const identityProgress = isIdVerified 
    ? 100 
    : Math.max(
        Math.min(Math.round((visualSeconds / totalDuration) * 100), 99),
        verifyingBrand?.identity_progress || 0 // Always show at least what the DB says
    );

    const websiteProgress = isMetaVerified 
        ? 100 
        : Math.max(
            Math.min(Math.round((visualMetaSeconds / totalDuration) * 100), 99),
            verifyingBrand?.meta_progress || 0
        );

    // --- 4. HANDLERS ---
    const handleInputChange = (e) => {
        if (isReadOnly) return;
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
        if (!brandName.trim() || !domain.trim() || !lightLogo || !darkLogo) {
            setError('Please complete all fields and uploads.');
            return;
        }

        setError('');
        setIsVerifying(true); 

        const formDataToSend = new FormData();
        formDataToSend.append('brand_name', brandName);
        formDataToSend.append('website_url', domain);
        formDataToSend.append('light_logo', lightLogo);
        formDataToSend.append('dark_logo', darkLogo);
        formDataToSend.append('user_id', userId);

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
            } else {
                setError(data.main_message || 'Upload failed.');
                setIsVerifying(false);
            }
        } catch (err) {
            setError('Could not connect to the server.');
            setIsVerifying(false);
        }
    };

    // --- 5. UPDATED PROGRESS TIMER EFFECT ---
    useEffect(() => {
        let timer;
        if (isVerifying) {
            timer = setInterval(() => {
                // Identity Tick: only if inprogress
                if (isIdInProgress && visualSeconds < totalDuration) {
                    setVisualSeconds(prev => prev + 1);
                }
                // Meta Tick: only if inprogress (implies identity is likely verified)
                if (isMetaInProgress && visualMetaSeconds < totalDuration) {
                    setVisualMetaSeconds(prev => prev + 1);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isVerifying, isIdInProgress, isMetaInProgress, visualSeconds, visualMetaSeconds]);

    if (isLoading) return <div className="brands-container">Loading brand data...</div>;

    const notes = typeof identityNotes === "string"
        ? JSON.parse(identityNotes)
        : identityNotes;
    return (
        <div className="brands-page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'top', minHeight: '80vh' }}>
            <div className="brands-container animate__animated animate__fadeIn" style={{ display: 'flex', width: '100%', margin: '0 auto', gap: '40px' }}>
                
                {/* LEFT COLUMN */}
                <div className="brands-col-left" style={{ flex: 1 }}>
                    <button className="back-to-dashboard-btn" onClick={() => setActiveTab('Start Now')}>
                        ← Back to Dashboard
                    </button>

                    {isIdVerified ? (
                        <div className="verification-panel animate__animated animate__fadeIn">
                            <h2 className="panel-brand-header">{verifyingBrand?.brand_name}</h2>
                            <h3 className="panel-main-title">Identity Verified!</h3>
                            
                            <p className="panel-description">
                                Please paste your verification meta tag into the <code>&lt;head&gt;</code> of your website.
                            </p>
                            
                            <div className="code-block-container">
                                <div className="code-block-header">
                                    <span className="code-lang">🔗 HTML</span>
                                    <button
                                    className="copy-btn-minimal"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                `<!-- BrandBased Official Verification -->
                                <meta name="brandbased-official" content="BB-VERIFIED-${verifyingBrand.brand_unique_id}">

                                <!-- BrandBased Runtime -->
                                <script src="https://cdn.brandbased.ai/runtime/v1.js" data-bb-id="${verifyingBrand.brand_unique_id}" async></script>`
                                        )
                                    }
                                    >
                                    Copy
                                    </button>
                                </div>

                                <div className="code-block-body">
                                    <code
                                    className="code-tag"
                                    style={{
                                        whiteSpace: 'pre',
                                        overflowX: 'auto',
                                        display: 'block',
                                        textAlign: 'left'
                                    }}
                                    >
                                {`<!-- BrandBased Official Verification -->
                                <meta name="brandbased-official" content="BB-VERIFIED-${verifyingBrand.brand_unique_id}">

                                <!-- BrandBased Runtime -->
                                <script src="https://cdn.brandbased.ai/runtime/v1.js" data-bb-id="${verifyingBrand.brand_unique_id}" async></script>`}
                                    </code>
                                </div>
                            </div>

                            <button className="sync-action-btn button-blue" onClick={handleVerifyWebsite}>
                                Sync Website Status
                            </button>

                            {/* WEBSITE META PROGRESS LOGIC */}
                            <div className="progress-section" style={{ marginTop: '30px' }}>
                                {isMetaInProgress ? (
                                    <>
                                        <div className="progress-bar-background">
                                            <div className="progress-bar-fill" style={{ width: `${websiteProgress}%`, backgroundColor: '#4a90e2', transition: 'width 1s linear' }}>
                                                <span className="progress-text">{websiteProgress}%</span>
                                            </div>
                                        </div>
                                        <p className="status-label" style={{ marginTop: '10px' }}>Scanning website for meta tag...</p>
                                    </>
                                ) : isMetaUnderReview ? (
                                    <div className="status-badge review">Under Review: Analyzing Meta Tag...</div>
                                ) : isMetaRejected ? (
                                    <div className="status-badge rejected">Verification Failed: {websiteNotes || 'Tag not found'}</div>
                                ) : isMetaVerified ? (
                                    <div className="final-success-badge" style={{ color: 'green', fontWeight: 'bold' }}>
                                        ✓ Website Fully Verified
                                    </div>
                                ) : (
                                    <p className="status-label">Waiting to start website scan...</p>
                                )}
                            </div>

                             {websiteNotes && !isMetaRejected && (
                                <div className="verification-notes-container">
                                    <p className="status-label">{websiteNotes}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="setup-stage">
                            <h3 className="brands-title">{isReadOnly ? 'Brand Verification' : 'Create Your Brand'}</h3>
                            <div className="brands-form-wrapper">
                                {error && <div className="validation-error-msg">{error}</div>}

                                <div className="brands-input-group">
                                    <input 
                                        name="brandName"
                                        type="text" 
                                        className="brands-main-input" 
                                        placeholder="Brand name" 
                                        value={formData.brandName} 
                                        disabled={isReadOnly}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="brands-input-group">
                                    <input 
                                        name="domain"
                                        type="text" 
                                        className="brands-main-input" 
                                        placeholder="Enter your brand website domain" 
                                        value={formData.domain}
                                        disabled={isReadOnly}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="brands-upload-container">
                                    <p className="brands-upload-text">Upload your brand logo</p>
                                    <div className="brands-upload-grid">
                                        <label className={`brands-upload-item ${isReadOnly ? 'disabled-label' : ''}`}>
                                            <input type="file" accept=".svg,.eps" hidden disabled={isReadOnly} onChange={(e) => handleFileChange(e, 'lightLogo')} />
                                            <div className={`brands-upload-box light-box ${formData.lightLogo || verifyingBrand?.logo_light_url ? 'uploaded' : ''}`}>
                                                <div className="brands-plus-icon">{(formData.lightLogo || verifyingBrand?.logo_light_url) ? '✓' : '+'}</div>
                                                <span className="brands-format-text">{formData.lightLogo?.name || (verifyingBrand?.logo_light_url ? 'Logo Saved' : 'Light Logo (SVG/EPS)')}</span>
                                            </div>
                                        </label>

                                        <label className={`brands-upload-item ${isReadOnly ? 'disabled-label' : ''}`}>
                                            <input type="file" accept=".svg,.eps" hidden disabled={isReadOnly} onChange={(e) => handleFileChange(e, 'darkLogo')} />
                                            <div className={`brands-upload-box dark-box ${formData.darkLogo || verifyingBrand?.logo_dark_url ? 'uploaded' : ''}`}>
                                                <div className="brands-plus-icon">{(formData.darkLogo || verifyingBrand?.logo_dark_url) ? '✓' : '+'}</div>
                                                <span className="brands-format-text">{formData.darkLogo?.name || (verifyingBrand?.logo_dark_url ? 'Logo Saved' : 'Dark Logo (SVG/EPS)')}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {!isReadOnly && <button className="brands-btn-continue" onClick={handleContinue}>Continue</button>}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - IDENTITY PROGRESS */}
                {(verifyingBrand || isVerifying) ? (
    <div className="brands-col-right" style={{ flex: 1 }}>
        <div className="vertical-divider"></div>
        <div className="verification-status-container" style={{ paddingLeft: '40px' }}>
            <h3 className="success-header">Brand Identity Verification</h3>
            
            <div className="success-logo-container">
                {verifyingBrand?.logo_dark_url && (
                    <img src={verifyingBrand.logo_dark_url} className="main-success-logo" alt="Brand Logo" />
                )}
                {isIdVerified && <div className="green-check-badge">✓</div>}
            </div>

            <div className="progress-section">
                {isIdInProgress ? (
                    <>
                        <div className="progress-bar-background">
                            <div className="progress-bar-fill" style={{ width: `${identityProgress}%`, transition: 'width 1s linear' }}>
                                <span className="progress-text">{identityProgress}%</span>
                            </div>
                        </div>
                        <p className="status-label">Verifying Identity...</p>
                    </>
                ) : isIdUnderReview ? (
                    <div className="status-badge review">Under Review: Please contact support.</div>
                ) : isIdRejected ? (
                    <div className="status-badge rejected">Identity Flagged: Please contact support.</div>
                ) : isIdVerified ? (
                    <div className="verified-details-section">
                        <p className="status-label verified-text" style={{fontSize: '2.0rem', color: 'green', fontWeight: 'bold' }}>
                            Identity Verified
                        </p>
                    </div>
                ) : (
                    <p className="status-label">Waiting to process identity...</p>
                )}
            </div>

            {identityNotes && !isIdVerified &&  (
               <div className="identity-notes-box" style={{ marginTop: '15px' }}>
                    <div className="status-label" style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6' }}>

                        <p><strong>Status:</strong> {notes?.consensus?.identity_status}</p>
                        <p><strong>Message:</strong> {notes?.message}</p>

                        <hr style={{ margin: '10px 0' }} />

                        <p><strong>Rule-Based:</strong> {notes?.rule_result?.passed ? "✅ Passed" : "❌ Failed"}</p>

                        {notes?.rule_result?.issues?.length > 0 && (
                        <ul>
                            {notes.rule_result.issues.map((issue, index) => (
                            <li key={index}>⚠️ {issue}</li>
                            ))}
                        </ul>
                        )}

                        <p><strong>AI Validation:</strong> {notes?.openai_result?.passed ? "✅ Passed" : "❌ Failed"}</p>

                        {notes?.openai_result?.reason && (
                        <p>💡 {notes.openai_result.reason}</p>
                        )}

                        {notes?.security_results?.length > 0 && (
                        <>
                            <hr style={{ margin: '10px 0' }} />
                            <p><strong>Security Check:</strong></p>
                            <ul>
                            {notes.security_results.map((item, i) => (
                                <li key={i}>
                                {item.file} → {item.passed ? "✅ Safe" : "❌ Issue"}
                                </li>
                            ))}
                            </ul>
                        </>
                        )}

                    </div>

                    <button className="sync-action-btn button-blue">
                        + Create New Brand
                    </button>
                </div>
            )}
        </div>
    </div>
) : (
    // ✅ ELSE PART (your requirement)
    <div className="brands-col-right" style={{ flex: 1 }}>
        <div className="vertical-divider"></div>
        <div className="verification-status-container" style={{ paddingLeft: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h3 className="success-header">Brand Identity Verification</h3>
                <p className="status-label" style={{ color: '#666', lineHeight: '1.6' }}>
                    Once you submit your website and brand logo, the validation process will be initiated automatically.
                </p>
            </div>

        </div>
    </div>
)}
                
            </div>
        </div>
    );
};

export default BrandCreation;