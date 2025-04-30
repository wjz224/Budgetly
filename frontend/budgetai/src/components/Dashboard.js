import React from 'react';
import Sidebar from './Sidebar';
import '../css/Dashboard.css';

function Dashboard() {
    const handleSignOut = () => {
        // Add sign-out logic here
        console.log("User signed out");
    };
    
    return (
        <div className="dashboard-container">
            <Sidebar onSignOut={handleSignOut} />
            <main className="dashboard-main-content">
                <div className="page-header">
                    <h2>Dashboard</h2>
                </div>
                <p>Welcome to your dashboard!</p>
            </main>
        </div>
    );
}

export default Dashboard;