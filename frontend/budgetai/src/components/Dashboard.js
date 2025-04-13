import React from 'react';
import '../css/dashboard.css';

function Dashboard() {


    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <nav>
                    <ul className="dashboard-nav-list">
                        <li className="dashboard-nav-item">Home</li>
                        <li className="dashboard-nav-item">Profile</li>
                        <li className="dashboard-nav-item">Settings</li>
                        <li className="dashboard-nav-item">Logout</li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main-content">
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard! Add your content here.</p>
            </main>
        </div>
    );
}

export default Dashboard;