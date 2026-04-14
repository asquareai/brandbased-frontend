import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './features/auth/SignupPage';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/dashboard'; 
import ForgotPassword from './features/auth/ForgotPassword';
import LandingPage from './features/dashboard/LandingPage';
import LogoutPage from './features/auth/LogoutPage';

// 1. Simple Maintenance Component
const Maintenance = () => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
    <h1 style={{ fontSize: '2.5rem', color: '#333' }}>BrandBased is Coming Soon</h1>
    <p style={{ fontSize: '1.2rem', color: '#666' }}>Our team is currently preparing the platform for launch.</p>
    <p style={{ fontSize: '1rem', color: '#888', marginTop: '10px' }}>Stay tuned for updates!</p>
  </div>
);

function App() {
  // 2. Control Switch
  // Set this to 'false' later when you are ready to show the login/dashboard
  const isUnderConstruction = true;

  const isAuthenticated = !!localStorage.getItem('auth_token');

  // 3. Conditional Render
  if (isUnderConstruction) {
    return <Maintenance />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <DashboardPage /> : 
            <Navigate to="/login" />
          } 
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch-all for 404s */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;