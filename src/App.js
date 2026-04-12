import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './features/auth/SignupPage';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/dashboard'; // Matches your dashboard.jsx
import ForgotPassword from './features/auth/ForgotPassword';
import LandingPage from './features/dashboard/LandingPage';
import LogoutPage from './features/auth/LogoutPage';

function App() {
  // Helper to check authentication from localStorage
  const isAuthenticated = !!localStorage.getItem('auth_token');

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
        {/* Choice A: BrandUpload is imported inside dashboard.jsx */}
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