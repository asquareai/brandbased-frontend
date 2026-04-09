import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';

const DashboardPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch the user details using the Bearer Token automatically
                const response = await api.get('/user'); 
                setUser(response.data);
            } catch (error) {
                console.error("Session expired");
                window.location.href = '/login';
            }
        };
        fetchUserData();
    }, []);

    return (
        <DashboardLayout userEmail={user?.email}>
            <h2 id="content-heading">Start Now</h2>
            <div className="dashboard-grid">
                {/* Your Dashboard Content (Charts/Buttons) goes here */}
                <div className="welcome-card">
                    <h3>Welcome back, {user?.email}</h3>
                    <p>Your Pro Appraisal AI Terminal is ready.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;