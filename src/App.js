import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './features/auth/SignupPage';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/dashboard'; 
import ForgotPassword from './features/auth/ForgotPassword';
import LandingPage from './features/dashboard/LandingPage';
import LogoutPage from './features/auth/LogoutPage';
import BrandCreation from './components/BrandCreation'; // Updated Import

const Maintenance = () => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
    <h1 style={{ fontSize: '2.5rem', color: '#333' }}>BrandBased is Coming Soon</h1>
    <p style={{ fontSize: '1.2rem', color: '#666' }}>Preparing the platform for launch.</p>
    {/* Subtle link for you to access the login if needed without typing URL */}
    <a href="/login" style={{ marginTop: '20px', color: '#eee', textDecoration: 'none', fontSize: '10px' }}>Admin Portal</a>
  </div>
);

function App() {
  // We check for the token but DON'T force a redirect in the top level
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <Router>
      <Routes>
        {/* 1. PUBLIC LANDING: This is the ONLY thing the public sees */}
        <Route path="/" element={<Maintenance />} />

        {/* 2. AUTH ROUTES: These are active but "unlisted" */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* 3. PROTECTED ROUTES: Only accessible if logged in */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route path="/brand/new" element={<BrandCreation />} />
        
        <Route 
          path="/landing" 
          element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" replace />} 
        />

        {/* 4. CATCH-ALL: Force everything else back to Maintenance */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;